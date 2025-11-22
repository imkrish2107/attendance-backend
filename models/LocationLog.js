// backend_node/models/LocationLog.js
const mongoose = require("mongoose");

const LocationLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isInsideOffice: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ["inside", "outside", "away"],
    default: "outside",
  },
  travelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "TravelRequest",
    default: null
  }
});

module.exports = mongoose.model("LocationLog", LocationLogSchema);
