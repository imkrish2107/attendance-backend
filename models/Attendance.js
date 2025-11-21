const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  checkInTime: String,
  checkOutTime: String,
  status: String,
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
