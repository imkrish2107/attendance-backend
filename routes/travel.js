const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth');
const Travel = require('../models/TravelRequest');

// Start Travel
router.post('/start', requireAuth(['employee']), async (req, res) => {
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
});

// Stop Travel
router.post('/:id/stop', requireAuth(['employee']), async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.endTime = new Date();
    await travel.save();

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Manager: Approve
router.post('/:id/approve', requireAuth(['manager', 'admin']), async (req, res) => {
  try {
    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.status = 'approved';
    await travel.save();

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Manager: Reject
router.post('/:id/reject', requireAuth(['manager', 'admin']), async (req, res) => {
  try {
    const { note } = req.body;

    const travel = await Travel.findById(req.params.id);
    if (!travel) return res.status(404).json({ error: 'Not found' });

    travel.status = 'rejected';
    travel.rejectionNote = note || '';
    await travel.save();

    res.json({ ok: true, travel });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
