// backend_node/routes/approval.js

const router = require("express").Router();
const auth = require("../middleware/auth");
const requireManager = require("../middleware/requireManager");

const {
  createRequest,
  getPendingRequests,
  approveRequest,
  rejectRequest,
  getApprovedRequests,
  getRejectedRequests
} = require("../controllers/approvalController");

// Employee side
router.post("/request", auth, createRequest);

// Manager side
router.get("/pending", auth, requireManager, getPendingRequests);
router.post("/approve", auth, requireManager, approveRequest);
router.post("/reject", auth, requireManager, rejectRequest);
router.get("/approved", auth, requireManager, getApprovedRequests);
router.get("/rejected", auth, requireManager, getRejectedRequests);

module.exports = router;
