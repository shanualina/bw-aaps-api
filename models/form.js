const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const formSchema = mongoose.Schema({
  moNumber: { type: String, },
  adharNumber: { type: String, },
  firstName: { type: String },
  middleName: { type: String },
  lastName: { type: String },
  fatherName: { type: String },
  gender: { type: String },
  address1: { type: String },
  address2: { type: String },
  address3: { type: String },
  area: { type: String },
  cast: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  SKILLS: { type: Array },
  otp: { type: String },
  CORE_SKILLS: { type: Array },
  date_of_birth: { type: String },
  WORK_EXPERIENCE: { type: Array },
  postal_area: { type: String },
  online_user: { type: Number },
  wallet_amount: { type: Number },
  referral_code: { type: String },
  referralPersoncode:{ type: String },
  imagePath: {
    type: Array
  },
  agreement: { type: String }
});

formSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Form", formSchema);