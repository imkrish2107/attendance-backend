const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  requestTravel,
  approveTravel,
} = require("../controllers/travelController");

router.post("/request", auth, requestTravel);
router.post("/approve/:id", auth, approveTravel);

module.exports = router;
