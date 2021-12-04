const mongoose = require('mongoose');

//sn, formId, formNumber, formName, dateCreated, status
const formSchema = new mongoose.Schema({
  sn: Number,
  formId: String,
  formNumber: Number,
  formName: String,
  dateCreated: {
    type: Date,
    default: Date.now()
  },
  status: {
    type: Number,
    default: 2
  },
  
});

const formModel = mongoose.model('FormApplicaiton', formSchema);

module.exports = formModel;
