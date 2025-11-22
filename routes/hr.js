// backend_node/routes/hr.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const requireManager = require("../middleware/requireManager");
const { getActiveStatus } = require("../controllers/hrController");

// GET /api/hr/active-status?includeAbsent=true
router.get("/active-status", auth, requireManager, getActiveStatus);

module.exports = router;
