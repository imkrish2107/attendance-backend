// backend_node/controllers/locationController.js
const LocationLog = require("../models/LocationLog");
const Travel = require("../models/TravelRequest");
const { distanceMeters } = require("../utils/geofence");

const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG);
const RADIUS = parseInt(process.env.GEOFENCE_RADIUS);

// Save location (from mobile). Accepts optional travelId to associate path with a travel.
exports.trackLocation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, travelId } = req.body;

    const distance = distanceMeters(OFFICE_LAT, OFFICE_LNG, latitude, longitude);
    const insideOffice = distance <= RADIUS;
    const status = insideOffice ? "inside" : "outside";

    const log = await LocationLog.create({
      userId,
      latitude,
      longitude,
      status,
      isInsideOffice: insideOffice,
      travelId: travelId || null,
      timestamp: new Date(),
    });

    // If travelId provided and inside office, optionally mark travel completed
    if (travelId && insideOffice) {
      const travel = await Travel.findOne({ _id: travelId, status: "approved", end: null });
      if (travel) {
        travel.status = "completed";
        travel.end = new Date();
        await travel.save();
      }
    }

    return res.json({ ok: true, status, log });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// GET latest location for all users (for live location map)
// returns array [{ userId, latitude, longitude, timestamp }]
exports.getLatestLocations = async (req, res) => {
  try {
    // Aggregate to get last location per user
    const latest = await LocationLog.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: { _id: "$userId", doc: { $first: "$$ROOT" } } },
      { $replaceRoot: { newRoot: "$doc" } },
    ]);

    return res.json({ ok: true, latest });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// GET latest location for specific user
exports.getLatestForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const latest = await LocationLog.findOne({ userId }).sort({ timestamp: -1 });
    return res.json({ ok: true, latest });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  trackLocation: exports.trackLocation,
  getLatestLocations: exports.getLatestLocations,
  getLatestForUser: exports.getLatestForUser,
};
