const mongoose = require("mongoose");

const all_india = mongoose.Schema({
    officename: { type: String},
    pincode: { type: String},
    Deliverystatus : { type: String},
    divisionname: { type: String},
    regionname : { type: String},
    circlename: { type: String}, 
    Taluk : { type: String},
    Districtname: { type: String},
    statename: { type: String},
    Telephone: { type: String},
     RelatedHeadoffice: { type: String},
     RelatedHeadoffice: { type: String},
    longitude : { type: String},
    latitude : { type: String},
  }, {collection: 'ALLIndiaPinCode'});
  
  
  module.exports = mongoose.model("ALLIndiaPinCode", all_india);