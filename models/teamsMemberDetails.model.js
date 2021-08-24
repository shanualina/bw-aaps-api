const mongoose = require("mongoose");
const teamsMemberSchema = mongoose.Schema({
    teamId: { type: String },
    memberId: { type: String },
    userName: { type: String },
    mobileNumber: { type: String },
    workArea: { type: String },
    status: { type: String },
}, { collection: 'teamsMemberDetails' });

module.exports = mongoose.model("teamsMemberDetails", teamsMemberSchema);

