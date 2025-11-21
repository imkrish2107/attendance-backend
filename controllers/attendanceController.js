// controllers/attendanceController.js
const AttendanceEvent = require('../models/AttendanceEvent');
const TravelRequest = require('../models/TravelRequest');
const attendanceCalc = require('../services/attendanceCalculator');

// ----- CHECK IN -----
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { locationId, lat, lng } = req.body;

    const ev = await AttendanceEvent.create({
      userId,
      type: 'checkin',
      timestamp: new Date(),
      locationId: locationId || null,
      rawLat: lat || null,
      rawLng: lng || null
    });

    res.json({ ok: true, event: ev });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ----- CHECK OUT -----
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const { locationId, lat, lng } = req.body;

    const ev = await AttendanceEvent.create({
      userId,
      type: 'checkout',
      timestamp: new Date(),
      locationId: locationId || null,
      rawLat: lat || null,
      rawLng: lng || null
    });

    res.json({ ok: true, event: ev });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ----- GET EVENTS FOR A DATE -----
exports.getEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.query.date;
    if (!date) return res.status(400).json({ error: 'date query missing (YYYY-MM-DD)' });

    const start = new Date(date + 'T00:00:00.000Z');
    const end = new Date(date + 'T23:59:59.999Z');

    const events = await AttendanceEvent.find({
      userId,
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 });

    res.json({ ok: true, events });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// ----- DAILY SUMMARY -----
exports.getTodaySummary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.query.date;

    if (!date) {
      return res.status(400).json({ error: 'date query missing (YYYY-MM-DD)' });
    }

    const start = new Date(date + "T00:00:00.000Z");
    const end = new Date(date + "T23:59:59.999Z");

    // Get attendance events for that day
    const attendanceEvents = await AttendanceEvent.find({
      userId,
      timestamp: { $gte: start, $lte: end }
    }).sort({ timestamp: 1 });

    // Get travel events for that day
    const travelEvents = await TravelRequest.find({
      userId,
      startTime: { $gte: start, $lte: end }
    });

    // Calculate summary
    const summary = attendanceCalc.calculate(attendanceEvents, travelEvents);

    res.json({ ok: true, summary });

  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    res.status(400).json({ error: err.message });
  }
};
