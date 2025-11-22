// backend_node/controllers/hrController.js
const Attendance = require("../models/Attendance");
const LocationLog = require("../models/LocationLog");
const TravelRequest = require("../models/TravelRequest");
const User = require("../models/User");
const { distanceMeters } = require("../utils/geofence");

const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG);
const RADIUS = parseInt(process.env.GEOFENCE_RADIUS);

// GET active status for all employees
// query param: includeAbsent=true|false
exports.getActiveStatus = async (req, res) => {
  try {
    const includeAbsent = req.query.includeAbsent === "true";

    // If includeAbsent -> get ALL users; else get those who checked in today
    const today = new Date().toISOString().substring(0, 10);

    let users;
    if (includeAbsent) {
      users = await User.find({}, "name _id role");
    } else {
      // get users who have attendance records today
      const atts = await Attendance.find({ date: today }).populate("userId", "name");
      users = atts.map(a => ({ _id: a.userId._id, name: a.userId.name }));
    }

    const result = [];

    for (const u of users) {
      const userId = u._id;

      // attendance for today (if exists)
      const att = await Attendance.findOne({ userId, date: today });

      // last location
      const lastLocation = await LocationLog.findOne({ userId }).sort({ timestamp: -1 });

      // active travel
      const activeTravel = await TravelRequest.findOne({ userId, status: "approved", end: null });

      let status = "absent";

      if (att && att.checkOutTime) status = "checked_out";
      else if (lastLocation) {
        const distance = distanceMeters(OFFICE_LAT, OFFICE_LNG, lastLocation.latitude, lastLocation.longitude);
        if (distance <= RADIUS) status = "in_office";
        else status = activeTravel ? "traveling" : "away";
      } else if (att && !att.checkInTime) {
        status = "absent";
      } else if (att && att.checkInTime && !att.checkOutTime) {
        // checked in but no location logs yet -> assume in_office
        status = "in_office";
      }

      result.push({
        userId,
        name: u.name,
        status,
        checkIn: att ? att.checkInTime : null,
        checkOut: att ? att.checkOutTime : null,
        lastLocation: lastLocation ? {
          latitude: lastLocation.latitude,
          longitude: lastLocation.longitude,
          timestamp: lastLocation.timestamp
        } : null,
        activeTravel: activeTravel ? {
          travelId: activeTravel._id,
          reason: activeTravel.reason,
          start: activeTravel.start
        } : null
      });
    }

    return res.json({ ok: true, data: result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getActiveStatus: exports.getActiveStatus
};
