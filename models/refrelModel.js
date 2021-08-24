const mongoose = require("mongoose");

const RefrealAmount = mongoose.Schema({
    REFRALAMOUNT: { type: Number},
  }, {collection: 'refralAmount'});
  
  module.exports = mongoose.model("refralAmount", RefrealAmount);