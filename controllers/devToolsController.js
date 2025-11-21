// controllers/devToolsController.js

const AttendanceEvent = require('../models/AttendanceEvent');

exports.deleteUserEventsForDate = async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.query.date; // YYYY-MM-DD

    if (!date) {
      return res.status(400).json({ error: "Missing ?date=YYYY-MM-DD" });
    }

    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.000Z");

    const result = await AttendanceEvent.deleteMany({
      userId,
      timestamp: { $gte: start, $lte: end }
    });

    res.json({
      ok: true,
      deletedCount: result.deletedCount
    });

  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ error: err.message });
  }
};
