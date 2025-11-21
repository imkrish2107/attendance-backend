const router = require("express").Router();
const auth = require("../middleware/auth");
const { trackLocation } = require("../controllers/locationController");

router.post("/track", auth, trackLocation);

module.exports = router;
