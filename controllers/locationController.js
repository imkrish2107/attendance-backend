const Location = require('../models/Location');

// Create Location
exports.createLocation = async (req, res) => {
  try {
    const { name, lat, lng, radius } = req.body;

    const loc = await Location.create({
      name,
      lat,
      lng,
      radius: radius || 50,
    });

    res.json({ ok: true, loc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Locations
exports.getLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json({ ok: true, locations });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Location
exports.updateLocation = async (req, res) => {
  try {
    const loc = await Location.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!loc) return res.status(404).json({ error: 'Location not found' });

    res.json({ ok: true, loc });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete Location
exports.deleteLocation = async (req, res) => {
  try {
    const loc = await Location.findByIdAndDelete(req.params.id);
    if (!loc) return res.status(404).json({ error: 'Location not found' });

    res.json({ ok: true, message: 'Location deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
