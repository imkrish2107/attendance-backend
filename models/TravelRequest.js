// backend_node/models/TravelRequest.js
const mongoose = require("mongoose");

const TravelRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  reason: { type: String, required: true },

  status: {
    type: String,
    enum: ["pending", "approved", "rejected", "completed"],
    default: "pending",
  },

  start: { type: Date, default: Date.now },
  end: { type: Date, default: null },

  destinationLat: { type: Number },   // optional (useful for future automation)
  destinationLng: { type: Number },   // optional

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("TravelRequest", TravelRequestSchema);
