const mongoose = require('mongoose');

const TravelRequestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  taskAssignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, default: null },

  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },

  rejectionNote: { type: String, default: '' }
});

module.exports = mongoose.model('TravelRequest', TravelRequestSchema);
