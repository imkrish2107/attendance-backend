// backend_node/routes/location.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  trackLocation,
  getLatestLocations,
  getLatestForUser,
} = require("../controllers/locationController");

router.post("/track", auth, trackLocation);

// GET latest for all users
router.get("/latest", auth, getLatestLocations);

// GET latest for user
router.get("/latest/:userId", auth, getLatestForUser);

module.exports = router;
