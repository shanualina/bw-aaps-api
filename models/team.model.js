const mongoose = require("mongoose");

const teamsSchema = mongoose.Schema({
    userId: { type: String },
    teamName: { type: String },
    team_leader_name:{ type: String },
    total_team_member:{ type: String },
    mobile_number:{ type: String },
    status:{ type: String },
}, { collection: 'teams' });


module.exports = mongoose.model("teams", teamsSchema);
