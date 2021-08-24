const mongoose = require("mongoose");

const additionalDocSchema = mongoose.Schema({
    userId: { type: String },
    docId: { type: String },
    docImage: { type: String },
    date:{ type: Date },
    status: { type: Number }
}, { collection: 'additionalDoc' });

module.exports = mongoose.model("additionalDoc", additionalDocSchema);