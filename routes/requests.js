// backend_node/routes/requests.js
const router = require("express").Router();
const auth = require("../middleware/auth");
const requireManager = require("../middleware/requireManager");
const {
  getPending,
  approve,
  reject
} = require("../controllers/requestsController");

// GET pending -> /attendance/requests/pending
router.get("/pending", auth, requireManager, getPending);

// POST approve -> /attendance/requests/:id/approve
router.post("/:id/approve", auth, requireManager, approve);

// POST reject -> /attendance/requests/:id/reject
router.post("/:id/reject", auth, requireManager, reject);

module.exports = router;
