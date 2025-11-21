// backend_node/controllers/attendanceController.js

const Attendance = require("../models/Attendance");
const LocationLog = require("../models/LocationLog");
const { distanceMeters } = require("../utils/geofence");

// ----------------------------------------
// OFFICE GEOFENCE SETTINGS
// ----------------------------------------
const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG);
const RADIUS = parseInt(process.env.GEOFENCE_RADIUS);

// ----------------------------------------
// CHECK-IN
// ----------------------------------------
exports.checkIn = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const distance = distanceMeters(
      OFFICE_LAT,
      OFFICE_LNG,
      latitude,
      longitude
    );

    if (distance > RADIUS) {
      return res.status(400).json({
        error: "You must be inside office to check in",
      });
    }

    const date = new Date().toISOString().substring(0, 10);

    const existing = await Attendance.findOne({ userId, date });
    if (existing) return res.status(400).json({ error: "Already checked in" });

    await Attendance.create({
      userId,
      date,
      checkInTime: new Date().toISOString(),
      status: "present",
    });

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ----------------------------------------
// CHECK-OUT
// ----------------------------------------
exports.checkOut = async (req, res) => {
  try {
    const userId = req.user.id;
    const date = new Date().toISOString().substring(0, 10);

    const attendance = await Attendance.findOne({ userId, date });
    if (!attendance)
      return res.status(400).json({ error: "Not checked in" });

    const checkInTime = new Date(attendance.checkInTime);
    const now = new Date();

    const diffHours = Math.floor((now - checkInTime) / 1000 / 60 / 60);

    if (diffHours < 10) {
      return res.status(400).json({
        error: `You can check out only after 10 hours (remaining ${
          10 - diffHours
        } hours)`,
      });
    }

    attendance.checkOutTime = now.toISOString();
    await attendance.save();

    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

// ----------------------------------------
// DAILY SUMMARY (used by dashboard)
// ----------------------------------------
exports.getDailySummary = async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.query.date || new Date().toISOString().substring(0, 10);

    const record = await Attendance.findOne({ userId, date });

    if (!record) {
      return res.json({
        date,
        status: "absent",
        checkInTime: null,
        checkOutTime: null,
      });
    }

    res.json(record);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ----------------------------------------
// TIMELINE EVENTS (IN/OUT logs)
// ----------------------------------------
exports.getUserEvents = async (req, res) => {
  try {
    const userId = req.params.userId;
    const date = req.query.date || new Date().toISOString().substring(0, 10);

    const events = await Attendance.find({ userId, date });

    res.json({ events });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ----------------------------------------
// LOCATION TRACKING (every 5 minutes)
// ----------------------------------------
exports.logLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude } = req.body;

    const distance = distanceMeters(
      OFFICE_LAT,
      OFFICE_LNG,
      latitude,
      longitude
    );

    const status = distance > RADIUS ? "away" : "inside";

    await LocationLog.create({
      userId,
      latitude,
      longitude,
      status,
      timestamp: new Date(),
    });

    res.json({ ok: true, status });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ----------------------------------------
// EXPORT ALL CONTROLLERS
// ----------------------------------------
module.exports = {
  checkIn: exports.checkIn,
  checkOut: exports.checkOut,
  getDailySummary: exports.getDailySummary,
  getUserEvents: exports.getUserEvents,
  logLocation: exports.logLocation,
};
