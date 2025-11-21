const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const Travel = require('../models/TravelRequest');

// Get Pending Travel Requests for manager
router.get('/pending', requireAuth(['manager', 'admin']), async (req, res) => {
  try {
    const pending = await Travel.find({ status: 'pending' })
      .populate('userId')
      .populate('taskAssignedBy');

    res.json({ ok: true, pending });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
