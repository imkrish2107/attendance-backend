const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/auth'); 
const ctrl = require('../controllers/attendanceController');

// Employee check-in / check-out
router.post('/checkin', requireAuth(['employee','manager','admin']), ctrl.checkIn);
router.post('/checkout', requireAuth(['employee','manager','admin']), ctrl.checkOut);

// Get all events for a specific user (timeline)
router.get('/events/:userId', requireAuth(['employee','manager','admin']), ctrl.getEvents);

// Get daily attendance summary
router.get('/daily/:userId', requireAuth(['employee','manager','admin']), ctrl.getTodaySummary);

module.exports = router;
