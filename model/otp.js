const mongoose = require('mongoose');

const smsSchema = new mongoose.Schema({
  email: {
    required: [true, 'Email Required'],
    type: String,
    unique: true,
  },
  phone: {
    required: [true, 'Phone Number Required'],
    type: Number,
  },
  status: { type: Number, default: 0 },
  otpEmail: String,
  otpPhone: String,
  dateCreated: { type: Date, default: Date.now(), required: true },
});

const smsModel = mongoose.model('Sms', smsSchema);

module.exports = smsModel;
