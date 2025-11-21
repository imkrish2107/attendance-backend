const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  latitude: Number,
  longitude: Number,
  timestamp: { type: Date, default: Date.now },
  insideOffice: Boolean,
  away: Boolean,
});

module.exports = mongoose.model("Location", LocationSchema);
