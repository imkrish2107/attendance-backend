const express = require('express');
const router = express.Router();
const { calculateDailyAttendance } = require('../services/attendanceCalculator');

router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const date = req.query.date;

        if (!date) return res.status(400).json({ error: "date query missing" });

        const summary = await calculateDailyAttendance(userId, date);
        res.json({ ok: true, summary });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
