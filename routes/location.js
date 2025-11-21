const express = require('express');
const router = express.Router();
const {
  createLocation,
  getLocations,
  updateLocation,
  deleteLocation
} = require('../controllers/locationController');

// No authentication added yet — optional
router.post('/', createLocation);
router.get('/', getLocations);
router.put('/:id', updateLocation);
router.delete('/:id', deleteLocation);

module.exports = router;
