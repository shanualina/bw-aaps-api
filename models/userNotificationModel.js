const mongoose = require("mongoose");

const UserNotifications = mongoose.Schema({
    NAME: { type: String},
    NEED: { type: String},
    COST: { type: String},
    TOTAL_AMOUNT: { type: String},
    MOBILE_NUMBER:{ type: Number},
    ADDRESS: { type: String},
    STATUS: { type: Number},
    DATE: {type:String}
  }, {collection: 'userNotification'});
  
  
  module.exports = mongoose.model("userNotification", UserNotifications);