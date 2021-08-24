const express = require("express");
const teamsModel = require("../models/team.model");
const teamsMemberDetailsModel = require("../models/teamsMemberDetails.model");
const teamNotification = require("../models/teamNotification.model");
const router = express.Router();

//create team name 
router.post("/save", async (req, res, next) => {
    try {
        const teams = await teamsModel.findOne({
            userId: req.body.userId,
            teamName: req.body.teamName,
        })
        if (!teams) {
            const teamMember = new teamsModel({
                userId: req.body.userId,
                teamName: req.body.teamName,
                status: req.body.status,
                team_leader_name:req.body.team_leader_name,
                total_team_member:req.body.total_team_member,
                mobile_number:req.body.mobile_number
            });
            const data = await teamMember.save()
            if (!data) {
                return res.status(400).json({
                    status: 400,
                    message: "bad request!"
                });
            }
            return res.status(200).json({
                status: 200,
                result: data
            });
        }
        else {
            return res.status(409).send({
                status: 409,
                message: 'team already exits'
            })
        }

    } catch (error) {
        return res.status(500).send({
            status: 500,
            message: 'unable to process'
        })
    }

});

//teams list
router.get("/teamlist/:userId", async (req, res, next) => {
    try {
        const data = await teamsModel.find({ userId: req.params.userId })
        if (!data) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        return res.status(200).json({ status: 200, data: data });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    }
})

//teams list
router.get("/:id", async (req, res, next) => {
    try {
        const data = await teamsModel.find({ _id: req.params.id })
        if (!data) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        return res.status(200).json({ status: 200, data: data });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    }
})
//update
router.post("/updateTeam/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await teamsModel.updateOne({ _id: id }, req.body)
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "no record found!"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "update sucessfully!"
        });
    }
    catch (error) {
        res.send({
            status: 500,
            message: "Unable to process"
        })
    }
});
//remove momber to teams
router.delete("/delete/:id", (req, res, next) => {
    teamsMemberDetailsModel.deleteOne({ _id: req.params.id }).then(result => {
        if (result) {
            res.status(200).json({
                status: 200,
                message: "delete successful!"
            });
        }
        else {
            res.status(404).json({
                status: 404,
                message: "id not found!"
            });
        }

    }).catch(err => {
        console.log(err);
    });
});
//get by primary key
router.get("/search/:id", (req, res, next) => {
    teamsMember.findOne({ _id: req.params.id }).then(data => {
        if (data) {
            res.status(200).json({
                status: 200,
                data: data
            });
        } else {
            res.status(404).json({
                status: 404,
                message: "no record found!"
            });
        }
    }).catch((err) => {
        res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    });
});
//update
router.post("/update/:id", async (req, res, next) => {
    try {
        const id = req.params.id;
        const data = await teamsMemberDetailsModel.updateOne({ _id: id }, req.body)
        if (!data) {
            return res.status(404).json({
                status: 404,
                message: "no record found!"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "update sucessfully!"
        });
    }
    catch (error) {
        res.send({
            status: 500,
            message: "Unable to process"
        })
    }
});
//add team members
router.post("/addmember", async (req, res, next) => {
    try {
        const teams = await teamsMemberDetailsModel.findOne({
            teamId: req.body.teamId,
            memberId: req.body.memberId,
        })
        if (!teams) {
            const teammembers = await teamsMemberDetailsModel.find({
                teamId: req.body.teamId
            })
            if (teammembers.length === 10) {
                return res.status(401).json({
                    status: 401,
                    message: "Team limit full!"
                });
            }
            else {
                const teamMemberDetails = new teamsMemberDetailsModel({
                    teamId: req.body.teamId,
                    memberId: req.body.memberId,
                    userName: req.body.userName,
                    mobileNumber: req.body.mobileNumber,
                    workArea: req.body.workArea,
                    status: req.body.status
                });
                const data = await teamMemberDetails.save()
                if (!data) {
                    return res.status(400).json({
                        status: 400,
                        message: "bad request!"
                    });
                }
                const teams = await teamsModel.findOne({
                    _id: req.body.teamId,
                })
                const teamNotifications = new teamNotification({
                    userId: req.body.memberId,
                    memberId: teamMemberDetails._id,
                    message: "hello " + req.body.userName + "" + teams.teamName + " send a inviation request",
                    status: 1
                });
                const teamNotify = await teamNotifications.save()
                return res.status(200).json({
                    status: 200,
                    result: data
                });
            }

        }
        else {
            return res.status(409).send({
                status: 409,
                message: 'member already exits'
            })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            status: 500,
            message: 'unable to process'
        })
    }

});
//team member list
router.get("/teammemberlist/:teamId", async (req, res, next) => {
    try {
        const data = await teamsMemberDetailsModel.find({ teamId: req.params.teamId })
        if (!data) {
            return res.status(404).json({ message: "User Not Found!" });
        }
        return res.status(200).json({ status: 200, data: data });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err
        });
    }
})
//delete team
router.delete("/deleteteam/:id", async (req, res, next) => {
    try {
        const results = await teamsModel.deleteMany({ _id: req.params.id })
        if (!results) {
            return res.status(404).json({
                status: 404,
                message: "id not found!"
            });
        }
        else {
            const teammenver = await teamsMemberDetailsModel.deleteMany({ teamId: req.params.id })
            if (!teammenver) {
                return res.status(404).json({
                    status: 404,
                    message: "id not found!"
                });
            }
            return res.status(200).json({
                status: 200,
                message: "delete successful!"
            });
        }

    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: "unable to process!"
        });
    }
});

router.get("/notiifcation/:id", async (req, res, next) => {
    try {
        const results = await teamNotification.find({
            userId: req.params.id,
            status: 1
        })
        if (!results) {
            return res.status(404).json({
                status: 404,
                message: "id not found!"
            });
        }
        return res.status(200).json({
            status: 404,
            data: results
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: "unable to process!"
        });
    }
});

// update notifcation status
router.post("/updatenoitifcation/:id", async (req, res, next) => {
    try {
        const results = await teamNotification.updateOne({ _id: req.params.id }, req.body)
        if (!results) {
            return res.status(404).json({
                status: 404,
                message: "id not found!"
            });
        }
        return res.status(200).json({
            status: 200,
            message: "update sucessfully!"
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            status: 500,
            message: "unable to process!"
        });
    }
});


module.exports = router;

