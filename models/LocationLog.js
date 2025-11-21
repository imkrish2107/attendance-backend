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
});

module.exports = mongoose.model("LocationLog", LocationLogSchema);
