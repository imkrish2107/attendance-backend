const router = require("express").Router();
const auth = require("../middleware/auth");
const requireManager = require("../middleware/requireManager");

const {
  getOverview,
  getEmployeesToday,
} = require("../controllers/adminAttendanceController");

router.get("/overview", auth, requireManager, getOverview);
router.get("/employees/today", auth, requireManager, getEmployeesToday);

module.exports = router;
