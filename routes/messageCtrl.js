const express = require("express");
const  MESSAGE = require("../models/mesageModels");

const router = express.Router();

  router.post('/save', (req, res, next) => {
    const message = new MESSAGE({
        MESSAGE: req.body.MESSAGE,
        USER_ID: req.body.USER_ID,
        PARTNER_ID: req.body.PARTNER_ID,
    });
    message.save()
    .then(result => {
      res.status(201).json({
        data: result
      });
    });
  });
  router.get("/:id", (req, res, next) => {
    MESSAGE.find({PARTNER_ID: req.params.id}).then(data => {
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

