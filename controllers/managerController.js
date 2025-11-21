const Travel = require('../models/TravelRequest');

// Get pending travel requests (for manager/admin)
exports.getPendingRequests = async (req, res) => {
  try {
    const pending = await Travel.find({ status: 'pending' })
      .populate('userId')
      .populate('taskAssignedBy');

    res.json({ ok: true, pending });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
