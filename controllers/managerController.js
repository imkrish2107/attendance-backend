const TravelRequest = require('../models/TravelRequest');
const User = require('../models/User');
const { sendToDevice } = require('../utils/fcm');

// GET all pending travel requests
exports.pendingRequests = async (req, res) => {
  const list = await TravelRequest.find({ status: 'pending' })
    .populate('userId', 'name phone');

  res.json({ ok: true, pending: list });
};


// APPROVE TRAVEL REQUEST
exports.approve = async (req, res) => {
  const { id } = req.params;

  const travel = await TravelRequest.findById(id);
  if (!travel) return res.status(404).json({ error: "Travel not found" });

  travel.status = "approved";
  await travel.save();

  // 🔥🔥 THIS IS WHERE YOU PASTE THE FCM CODE 🔥🔥
  const user = await User.findById(travel.userId);
  if (user && user.deviceToken) {
    await sendToDevice(user.deviceToken, {
      title: 'Travel Approved',
      body: 'Your travel request was approved',
      data: {
        type: 'travel_approved',
        travelId: travel._id.toString()
      }
    });
  }

  res.json({ ok: true, travel });
};


// REJECT TRAVEL REQUEST
exports.reject = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  const travel = await TravelRequest.findById(id);
  if (!travel) return res.status(404).json({ error: "Travel not found" });

  travel.status = "rejected";
  travel.rejectionNote = note || "";
  await travel.save();

  // Optional: Notify user of rejection
  const user = await User.findById(travel.userId);
  if (user && user.deviceToken) {
    await sendToDevice(user.deviceToken, {
      title: 'Travel Rejected',
      body: travel.rejectionNote || 'Your travel request was rejected',
      data: { type: 'travel_rejected' }
    });
  }

  res.json({ ok: true, travel });
};
