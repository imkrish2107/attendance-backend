const TravelRequest = require("../models/TravelRequest");
const User = require("../models/User");

// -----------------------------------------------------
// CREATE TRAVEL REQUEST (Employee)
// -----------------------------------------------------
async function createRequest(req, res) {
  try {
    const userId = req.user.id;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ error: "Reason is required" });
    }

    const reqDoc = await TravelRequest.create({
      userId,
      reason,
      status: "pending",
    });

    res.json({ ok: true, request: reqDoc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// LIST PENDING REQUESTS (Manager)
// -----------------------------------------------------
async function getPendingRequests(req, res) {
  try {
    const pending = await TravelRequest.find({ status: "pending" })
      .populate("userId", "name phone");

    res.json({ pending });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// APPROVE REQUEST
// -----------------------------------------------------
async function approveRequest(req, res) {
  try {
    const { requestId } = req.body;

    if (!requestId)
      return res.status(400).json({ error: "requestId is required" });

    const reqDoc = await TravelRequest.findById(requestId);
    if (!reqDoc)
      return res.status(404).json({ error: "Request not found" });

    reqDoc.status = "approved";
    await reqDoc.save();

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// REJECT REQUEST
// -----------------------------------------------------
async function rejectRequest(req, res) {
  try {
    const { requestId } = req.body;

    if (!requestId)
      return res.status(400).json({ error: "requestId is required" });

    const reqDoc = await TravelRequest.findById(requestId);
    if (!reqDoc)
      return res.status(404).json({ error: "Request not found" });

    reqDoc.status = "rejected";
    await reqDoc.save();

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// LIST APPROVED
// -----------------------------------------------------
async function getApprovedRequests(req, res) {
  try {
    const approved = await TravelRequest.find({ status: "approved" })
      .populate("userId", "name phone");

    res.json({ approved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// LIST REJECTED
// -----------------------------------------------------
async function getRejectedRequests(req, res) {
  try {
    const rejected = await TravelRequest.find({ status: "rejected" })
      .populate("userId", "name phone");

    res.json({ rejected });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// -----------------------------------------------------
// EXPORT ALL
// -----------------------------------------------------
module.exports = {
  createRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getApprovedRequests,
  getRejectedRequests,
};
