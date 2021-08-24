const mongoose = require("mongoose");

const partnerSkillSchema = mongoose.Schema({
    UID: { type: String },
    CORE_SKILLS: { type: Array },
    SKILLS: { type: Array },
    WORK_EXPERIENCE: { type: Array },
    STATUS: { type: Number },
}, { collection: 'partnerSkill' });


module.exports = mongoose.model("partnerSkill", partnerSkillSchema);