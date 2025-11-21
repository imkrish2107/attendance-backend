const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['employee', 'manager', 'admin'], default: 'employee' },
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  deviceToken: { type: String, default: '' } // for FCM later
});

module.exports = mongoose.model('User', UserSchema);
