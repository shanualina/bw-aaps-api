const mongoose = require("mongoose");
const partnerDocsSchema = mongoose.Schema({
    UID: { type: String },
    DOCUMENT_PATH: { type: String },
    CREATEDBY: { type: String },
    UPDATEDBY: { type: String },
    CREATEDAT: { type: Date },
    UPDATEDAT: { type: Date }
}, { collection: 'partnerDocs' });

module.exports = mongoose.model("partnerDocs", partnerDocsSchema);