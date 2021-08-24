const mongoose = require("mongoose");

const Notifications = mongoose.Schema({
    NAME: { type: String},
    NEED: { type: String},
    COST: { type: String},
    TOTAL_AMOUNT: { type: String},
    ADDRESS: { type: String},
    FILE_NAME:{type:Array},
    FILE_STATUS:{type:String},
    STATUS: { type: Number},
    DATE: {type:String}
  }, {collection: 'notification'});
  
  
  module.exports = mongoose.model("notification", Notifications);