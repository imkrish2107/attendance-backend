const mongoose = require('mongoose');

const AttendanceEventSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['checkin', 'checkout', 'travel_start', 'travel_end'], required: true },
    timestamp: { type: Date, default: Date.now },

    // For check-ins
    locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', default: null },

    // For travel
    travelId: { type: mongoose.Schema.Types.ObjectId, ref: 'TravelRequest', default: null }
});

module.exports = mongoose.model('AttendanceEvent', AttendanceEventSchema);
