const express = require("express");
const indiaPin = require("../models/allIndiaPinModel");

const router = express.Router();


  router.get("/getAllIndiaPin/:pinCode", (req, res, next) => {
    indiaPin.find({pincode: req.params.pinCode}).then(data => {
        // console.log(data)
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

module.exports = router;
