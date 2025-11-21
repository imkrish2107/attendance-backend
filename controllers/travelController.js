const Travel = require('../models/TravelRequest');
const User = require('../models/User');
const { sendPush } = require('../utils/fcm');

// START TRAVEL
exports.startTravel = async (req, res) => {
  try {
    const { reason, taskAssignedBy } = req.body;

    const travel = await Travel.create({
      userId: req.user.id,
      reason,
      taskAssignedBy,
      startTime: new Date()
    });

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// STOP TRAVEL
exports.stopTravel = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);

    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.endTime = new Date();
    await travel.save();

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// APPROVE TRAVEL
exports.approveTravel = async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.status = 'approved';
    await travel.save();

    // Notify the employee
    const employee = await User.findById(travel.userId);
    if (employee.deviceToken) {
      await sendPush(employee.deviceToken, 'Travel Approved', 'Your travel request has been approved.');
    }

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// REJECT TRAVEL
exports.rejectTravel = async (req, res) => {
  try {
    const { note } = req.body;
    const travel = await Travel.findById(req.params.id);

    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.status = 'rejected';
    travel.rejectionNote = note;
    await travel.save();

    // Notify employee
    const employee = await User.findById(travel.userId);
    if (employee.deviceToken) {
      await sendPush(employee.deviceToken, 'Travel Rejected', note || 'Travel request was rejected.');
    }

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
