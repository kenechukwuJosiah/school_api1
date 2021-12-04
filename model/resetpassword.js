const mongoose = require('mongoose');

const passResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  passtoken: Number,
  timegenerated: {type: Date, default: Date.now(), required: true},
  status: {type: Number, default: 0}
});

const resetModel = mongoose.model('PasswordReset', passResetSchema);

module.exports = resetModel;