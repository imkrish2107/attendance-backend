// backend_node/controllers/adminAttendanceController.js

const Attendance = require("../models/Attendance");
const LocationLog = require("../models/LocationLog");
const TravelRequest = require("../models/TravelRequest");
const { distanceMeters } = require("../utils/geofence");

const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG);
const RADIUS = parseInt(process.env.GEOFENCE_RADIUS);

// ======================================================
// HR OVERVIEW
// ======================================================

exports.getOverview = async (req, res) => {
  try {
    const today = new Date().toISOString().substring(0, 10);

    // GET ALL employees who checked in today
    const attendanceList = await Attendance.find({ date: today });

    let inOffice = 0;
    let checkedOut = 0;
    let traveling = 0;
    let away = 0;

    for (const a of attendanceList) {
      const userId = a.userId;

      // CASE 1 — Checked out
      if (a.checkOutTime) {
        checkedOut++;
        continue;
      }

      // Fetch last location
      const lastLocation = await LocationLog.findOne({ userId }).sort({
        timestamp: -1,
      });

      // Check approved travel (MUST NOT be rejected)
      const approvedTravel = await TravelRequest.findOne({
        userId,
        status: "approved",
      });

      // If no location logs → assume in office after check-in
      if (!lastLocation) {
        inOffice++;
        continue;
      }

      const distance = distanceMeters(
        OFFICE_LAT,
        OFFICE_LNG,
        lastLocation.latitude,
        lastLocation.longitude
      );

      // CASE 2 — OUTSIDE OFFICE
      if (distance > RADIUS) {
        if (approvedTravel) traveling++;
        else away++;

        continue;
      }

      // CASE 3 — INSIDE OFFICE
      inOffice++;
    }

    return res.json({
      ok: true,
      inOffice,
      checkedOut,
      traveling,
      away,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


// ======================================================
// HR — TODAY'S EMPLOYEE DETAILS LIST
// ======================================================

exports.getEmployeesToday = async (req, res) => {
  try {
    const today = new Date().toISOString().substring(0, 10);

    const attendanceList = await Attendance.find({ date: today }).populate(
      "userId",
      "name"
    );

    let employees = [];

    for (const a of attendanceList) {
      const user = a.userId;
      const userId = user._id;
      const name = user.name;

      // Last known location
      const lastLocation = await LocationLog.findOne({ userId }).sort({
        timestamp: -1,
      });

      // Approved travel?
      const approvedTravel = await TravelRequest.findOne({
        userId,
        status: "approved",
      });

      // Determine STATUS
      let status = "in_office";

      if (a.checkOutTime) {
        status = "checked_out";
      } else if (lastLocation) {
        const distance = distanceMeters(
          OFFICE_LAT,
          OFFICE_LNG,
          lastLocation.latitude,
          lastLocation.longitude
        );

        if (distance > RADIUS) {
          status = approvedTravel ? "traveling" : "away";
        }
      }

      // Working hours
      let hours = 0;

      if (a.checkInTime && a.checkOutTime) {
        hours =
          (new Date(a.checkOutTime) - new Date(a.checkInTime)) /
          (1000 * 60 * 60);
      } else if (a.checkInTime) {
        hours = (new Date() - new Date(a.checkInTime)) / (1000 * 60 * 60);
      }

      employees.push({
        userId,
        name,
        status,
        checkIn: a.checkInTime,
        checkOut: a.checkOutTime || null,
        hours: Number(hours.toFixed(2)),
      });
    }

    return res.json({ ok: true, employees });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
