// backend_node/routes/attendance.js

const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  checkIn,
  checkOut,
  getDailySummary,
  getUserEvents,
  logLocation,   // <-- THIS MUST BE IMPORTED
} = require("../controllers/attendanceController");

// CHECK-IN
router.post("/checkin", auth, checkIn);

// CHECK-OUT
router.post("/checkout", auth, checkOut);

// DAILY SUMMARY
router.get("/daily/:userId", auth, getDailySummary);

// TIMELINE EVENTS
router.get("/events/:userId", auth, getUserEvents);

// LOCATION LOGGING (every 5 minutes)
router.post("/log-location", auth, logLocation);

module.exports = router;
