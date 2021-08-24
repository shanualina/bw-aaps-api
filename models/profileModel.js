const mongoose = require("mongoose");

const Profile = mongoose.Schema({
    USER_ID: { type: String},
    IMAGE_PATH: { type: String},
  }, {collection: 'profile'});
  
  
  module.exports = mongoose.model("profile", Profile);