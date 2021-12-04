const mongoose = require('mongoose');

const jambDataSchema = new mongoose.Schema({
  j_reg: { type: String, unique: true },
  surname: String,
  name: String,
  otherName: String,
  lga: String,
  state: String,
  facutly: String,
  department: String,
  subjects: [
    {
      name: String,
      score: Number,
    },
  ],
  english: { type: Number, score: Number },
  linkStatus: {
    type: Number,
    default: 0,
  },
});

const jambDataModel = mongoose.model(`jambData`, jambDataSchema);

module.exports = jambDataModel;
