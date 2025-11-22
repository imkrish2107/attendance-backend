// backend_node/controllers/requestsController.js
const TravelRequest = require("../models/TravelRequest");
const User = require("../models/User");
const { sendToDevice } = require("../utils/fcm");

// GET pending requests (for managers)
exports.getPending = async (req, res) => {
  try {
    const pending = await TravelRequest.find({ status: "pending" }).populate("userId", "name");

    const requests = pending.map(t => ({
      id: t._id.toString(),
      userId: t.userId ? t.userId._id.toString() : t.userId,
      userName: t.userId ? (t.userId.name || "Unknown") : "Unknown",
      type: "travel",
      start: t.createdAt,
      end: t.endTime || null,
      reason: t.reason || ""
    }));

    res.json({ ok: true, requests });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Approve request by id
exports.approve = async (req, res) => {
  try {
    const id = req.params.id;
    const tr = await TravelRequest.findById(id);
    if (!tr) return res.status(404).json({ error: "Request not found" });

    tr.status = "approved";
    await tr.save();

    const user = await User.findById(tr.userId);
    if (user && user.deviceToken) {
      await sendToDevice(user.deviceToken, {
        title: "Travel Approved",
        body: tr.reason || "Your travel request is approved",
        data: { type: "travel_approved", travelId: tr._id.toString() }
      });
    }

    res.json({ ok: true, request: tr });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Reject request by id
exports.reject = async (req, res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;
    const tr = await TravelRequest.findById(id);
    if (!tr) return res.status(404).json({ error: "Request not found" });

    tr.status = "rejected";
    tr.rejectionNote = reason || "";
    await tr.save();

    const user = await User.findById(tr.userId);
    if (user && user.deviceToken) {
      await sendToDevice(user.deviceToken, {
        title: "Travel Rejected",
        body: tr.rejectionNote || "Your travel request was rejected",
        data: { type: "travel_rejected", travelId: tr._id.toString() }
      });
    }

    res.json({ ok: true, request: tr });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
