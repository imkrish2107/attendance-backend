const Travel = require("../models/TravelRequest");
const User = require("../models/User");
const { sendToDevice } = require("../utils/fcm");

exports.requestTravel = async (req, res) => {
  const { reason } = req.body;
  const userId = req.user.id;

  const travel = await Travel.create({ userId, reason });

  res.json({ ok: true, travel });
};

exports.approveTravel = async (req, res) => {
  const id = req.params.id;

  const travel = await Travel.findById(id);
  travel.approved = true;
  travel.rejected = false;
  await travel.save();

  const user = await User.findById(travel.userId);
  if (user.deviceToken) {
    await sendToDevice(user.deviceToken, {
      title: "Travel Approved",
      body: travel.reason,
      data: { type: "travel_approved" },
    });
  }

  res.json({ ok: true });
};
