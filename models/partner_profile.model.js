const mongoose = require("mongoose");
const partnerProfileSchema = mongoose.Schema({
    UID: { type: String },
    FIRSTNAME: { type: String },
    MIDDLENAME: { type: String },
    LASTNAME: { type: String },
    CONTACT_NUMBER: { type: String },
    ADDRESS: { type: String },
    COUNTRY: { type: String },
    STATE: { type: String },
    CITY: { type: String },
    PINCODE: { type: String },
    PRORFILEPIC: {  type: String },
    DOB: { type: String },
    WALLENTAMOUNT: { type: Number },
    REFERRALCODE: { type: String },
    REFFREDBY: { type: String },
}, { collection: 'partnerProfile' });


module.exports = mongoose.model("partnerProfile", partnerProfileSchema);