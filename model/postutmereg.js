const mongoose = require('mongoose');

const postutmeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email Required'],
    unique: true,
    lowercase: true,
  },
  phone: {
    type: Number,
    required: [true, 'Phone Number Required'],
  },
  dob: String,
  nextOfKinName: String,
  nextOfKinNumber: String,
  linkDate: { type: Date, default: Date.now(), required: true },
  status: { type: Number, default: 0 },
  stage: { type: Number, default: 0 },
  j_reg: { type: String, required: [true, 'Jamb reg number required'] },
});

const PutmeModel = (year) =>
  mongoose.model(`${year}_postutme_reg`, postutmeSchema);

module.exports = PutmeModel;
