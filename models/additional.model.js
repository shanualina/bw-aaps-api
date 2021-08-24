const mongoose = require("mongoose");

const additionalSchema = mongoose.Schema({
    name: { type: String },
    name_hindi:{ type: String },
    status: { type: Number }
},
    { collection: 'additional' });


module.exports = mongoose.model("additional", additionalSchema);