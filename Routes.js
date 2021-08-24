const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const formRoutes = require("./routes/form");
const jobRoutes = require("./routes/job");
const jobWorkAreaRoutes = require("./routes/jobWorkArea");
const jobSkillsRoutes = require("./routes/skillSets");
const subUsersRoutes = require("./routes/sub_users");
const allIndiaPincode = require('./routes/allIndiaPin');
const notificatioCtrl = require('./routes/notificatioCtrl');
const messages = require('./routes/messageCtrl');
const bankDetails = require('./routes/bankDetailsCtrl');
const familyDetailCtl = require('./routes/familyDetailCtl');
const userNotification= require('./routes/userNotificationCtrl');
const refral=require('./routes/refralAmountCtrl');
const teamsCtrl=require('./routes/teamsCtrl');
const additionalCtrl=require('./routes/additionalCtrl');
const Profile=require('./routes/profileCtrl');
const partnerCredential=require('./routes/partnerCredentialCtrl')
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });
    app.use("/api/user", userRoutes);
    app.use("/api/forms", formRoutes);
    app.use("/api/jobs", jobRoutes);
    app.use("/api/jobsWorkArea", jobWorkAreaRoutes);
    app.use("/api/skills", jobSkillsRoutes);
    app.use("/api/subUsers", subUsersRoutes);
    app.use("/api/allIndiaPostal", allIndiaPincode);
    app.use("/api/notification", notificatioCtrl);
    app.use("/api/userNotification", userNotification);
    app.use("/api/message", messages);
    app.use("/api/bankDetails", bankDetails);
    app.use("/api/familyDetail", familyDetailCtl);
    app.use("/api/refral", refral);
    app.use("/api/team", teamsCtrl);
    app.use("/api/additional", additionalCtrl);
    app.use("/api/profile",Profile);
    app.use("/api/partnercredential",partnerCredential)
    //read images
    app.use('/images', express.static('./images'));
}