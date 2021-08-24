const mongoose = require("mongoose");
const partnerCredentialsSchema = mongoose.Schema({
    USERNAME: { type: String },
    MONUMBER: { type: String },
    EMAIL: { type: String },
    PASSWORD: { type: String },
    OTP:{ type: String },
    DEVICE_ID: { type: String },
    DEVICE_TYPE: { type: String },
    NOTIFICATION_TOKEN: { type: String },
    APP_TOKEN: { type: String },
    LOGINTYPE: { type: String },
    STATUS: { type: String },
}, { collection: 'partnerCredentials' });


module.exports = mongoose.model("partnerCredentials", partnerCredentialsSchema);