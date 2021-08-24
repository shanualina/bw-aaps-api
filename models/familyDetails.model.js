const mongoose = require("mongoose");

const familyDetails = mongoose.Schema({
  userId: { type: String },
  FATHER_NAME: { type: String },
  FATHER_AGE: { type: Number },
  MOTHER_NAME: { type: String },
  MOTHER_AGE: { type: Number },
  WIFE_NAME: { type: String },
  WIFE_AGE: { type: Number },
  CHILD_NAME1:{ type: String },
  CHILD_NAME2: { type: String },
  CHILD_NAME3: { type: String },
  CHILD_NAME4: { type: String },
  CHILD_AGE1: { type: Number },
  CHILD_AGE2:{ type: Number },
  CHILD_AGE3:{ type: Number },
  CHILD_AGE4:{ type: Number },
}, { collection: 'familyDetails' });


module.exports = mongoose.model("familyDetails", familyDetails);