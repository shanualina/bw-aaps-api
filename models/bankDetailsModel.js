const mongoose = require("mongoose");

const BankDetails = mongoose.Schema({
  userId: { type: String },
  ACOOUNT_NUMBER: { type: String },
  IFSC: { type: String },
  ACCOUNT_HOLDER_NAME: { type: String },
  PHONE_NUMBER: { type: Number },
}, { collection: 'bankDetails' });


module.exports = mongoose.model("bankDetails", BankDetails);