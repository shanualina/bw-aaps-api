const express = require("express");
const  USERNOTIFICATION = require("../models/userNotificationModel");

const router = express.Router();

  router.post('/save', (req, res, next) => {
    var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        indiaTime = new Date(indiaTime);
    var dateTime = indiaTime.toLocaleString();
    const userNotification = new USERNOTIFICATION({
        NAME: req.body.NAME,
        NEED: req.body.NEED,
        COST:req.body.COST,
        TOTAL_AMOUNT: req.body.TOTAL_AMOUNT,
        MOBILE_NUMBER:req.body.MOBILE_NUMBER,
        ADDRESS: req.body.ADDRESS,
        STATUS: 1,
        DATE:dateTime
    });
    userNotification.save()
    .then(result => {
      res.status(201).json({
        data: result
      });
    });
  });

  router.get("/getAll", (req, res, next) => {
    USERNOTIFICATION.find().then(data => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ message: "Data not found!" });
        }
      }).catch((err) => {
        res.send({
            ERROR: err,
            STATUS: 0
        })
    });
});
router.post("/update/:id", (req, res, next) => {
    
    USERNOTIFICATION.updateOne({ _id: req.params.id}, req.body).then(result => {
      res.status(200).json({ message: "Update successful!" });
    }).catch(err => {
      console.log(err);
      res.send(err);
    });
  });

  module.exports = router;