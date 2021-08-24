const mongoose = require("mongoose");

const Messages = mongoose.Schema({
    MESSAGE: { type: String},
    USER_ID: { type: String},
    PARTNER_ID: { type: String},
  }, {collection: 'message'});
  
  
  module.exports = mongoose.model("message", Messages);