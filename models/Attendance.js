const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  type: { type: String, required: true }, // enter, exit, start_travel, stop_travel
  timestamp: { type: Date, required: true },
  locationId: { type: String, default: "" },
  reason: { type: String, default: "" },
  approved: { type: Boolean, default: false }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
