// backend_node/routes/travel.js
const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  requestTravel,
  approveTravel,
  endTravel,
  getTravelPath,
  getUserTravelHistory,
} = require("../controllers/travelController");

router.post("/request", auth, requestTravel);
router.post("/approve/:id", auth, approveTravel);
router.post("/end", auth, endTravel);

// New: travel path
router.get("/:travelId/path", auth, getTravelPath);

// New: user travel history
router.get("/user/:userId/history", auth, getUserTravelHistory);

module.exports = router;
