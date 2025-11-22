// backend_node/controllers/travelController.js
const Travel = require("../models/TravelRequest");
const LocationLog = require("../models/LocationLog");
const User = require("../models/User");

// Create travel request (employee)
exports.requestTravel = async (req, res) => {
  try {
    const { reason, destinationLat, destinationLng } = req.body;
    const userId = req.user.id;

    if (!reason) return res.status(400).json({ error: "reason required" });

    const travel = await Travel.create({
      userId,
      reason,
      destinationLat,
      destinationLng,
      status: "pending",
      start: new Date(),
    });

    return res.json({ ok: true, travel });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Approve travel (manager)
exports.approveTravel = async (req, res) => {
  try {
    const id = req.params.id;
    const travel = await Travel.findById(id);
    if (!travel) return res.status(404).json({ error: "Travel not found" });

    travel.status = "approved";
    await travel.save();

    return res.json({ ok: true, travel });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// End travel (employee presses "Reached Office")
exports.endTravel = async (req, res) => {
  try {
    const { travelId } = req.body;
    const userId = req.user.id;

    const travel = await Travel.findOne({
      _id: travelId,
      userId,
      status: "approved",
      end: null,
    });

    if (!travel) {
      return res.status(404).json({ error: "Active travel request not found" });
    }

    travel.status = "completed";
    travel.end = new Date();
    await travel.save();

    return res.json({ ok: true, message: "Travel marked as completed", travel });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET travel path (location logs linked to this travelId)
exports.getTravelPath = async (req, res) => {
  try {
    const { travelId } = req.params;
    const logs = await LocationLog.find({ travelId }).sort({ timestamp: 1 });
    return res.json({ ok: true, travelId, path: logs });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET user travel history (optional date range)
exports.getUserTravelHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const { from, to } = req.query;

    const q = { userId };
    if (from || to) {
      q.start = {};
      if (from) q.start.$gte = new Date(from);
      if (to) q.start.$lte = new Date(to);
    }

    const travels = await Travel.find(q).sort({ start: -1 });
    return res.json({ ok: true, travels });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  requestTravel: exports.requestTravel,
  approveTravel: exports.approveTravel,
  endTravel: exports.endTravel,
  getTravelPath: exports.getTravelPath,
  getUserTravelHistory: exports.getUserTravelHistory,
};
