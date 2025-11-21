const Location = require("../models/Location");
const { distanceInMeters } = require("../utils/geofence");
const TravelRequest = require("../models/TravelRequest");

const OFFICE_LAT = parseFloat(process.env.OFFICE_LAT);
const OFFICE_LNG = parseFloat(process.env.OFFICE_LNG);
const RADIUS = parseInt(process.env.GEOFENCE_RADIUS);

exports.trackLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id;

    const distance = distanceInMeters(
      OFFICE_LAT,
      OFFICE_LNG,
      latitude,
      longitude
    );

    const insideOffice = distance <= RADIUS;

    // detect travel ( > 500m )
    let away = false;
    if (distance > 500) {
      const approvedTravel = await TravelRequest.findOne({
        userId,
        approved: true,
      });

      away = !approvedTravel;
    }

    await Location.create({
      userId,
      latitude,
      longitude,
      insideOffice,
      away,
    });

    res.json({ ok: true, insideOffice, away, dist: distance });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
