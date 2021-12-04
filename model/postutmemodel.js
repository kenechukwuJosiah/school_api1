const mongoose = require('mongoose');
const validator = require('validator');

const PostutmRegSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name required'],
  },
  surname: { type: String, required: [true, 'Surname Required'] },
  phone: { type: String, required: [true, 'Phone Number Required'] },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Enter a valid Email'],
    required: [true, 'Email Required'],
  },
  password: { type: String, required: [true, 'Please Enter Password'] },
  validated: { type: Number, default: 0 },
});

const PostutmReg = mongoose.model('centralregs', PostutmRegSchema);

module.exports = PostutmReg;
