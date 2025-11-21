// routes/dev.js

const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/devToolsController');

// Delete user events for a specific date (DEV ONLY)
// Example: DELETE /api/dev/attendance/USER_ID?date=2025-11-21
router.delete('/attendance/:userId', ctrl.deleteUserEventsForDate);

module.exports = router;
