const mongoose = require("mongoose");
const teamNotificationSchema = mongoose.Schema({
    userId: { type: String },
    memberId: { type: String },
    message: { type: String },
    status: { type: Number },
}, { collection: 'teamNotification' });

module.exports = mongoose.model("teamNotification", teamNotificationSchema);

