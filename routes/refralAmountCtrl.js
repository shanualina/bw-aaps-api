const express = require("express");
const  REFRAL = require("../models/refrelModel");

const router = express.Router();

  router.post('/save', (req, res, next) => {
    const refral = new REFRAL({
        REFRALAMOUNT: req.body.REFRALAMOUNT,
    });
    refral.save()
    .then(result => {
      res.status(200).json({
        data: result
      });
    }).catch(err =>{
        res.send(err);
    })
  });


  router.post("/update/:id", (req, res, next) => {
    REFRAL.updateOne({ _id: req.params.id},  req.body).then(result => {
      res.status(200).json({ message: "Update successful!" });
    }).catch(err => {
      console.log(err);
      res.send(err);
    });
  });


  router.get("/getAll", (req, res, next) => {
    REFRAL.find().then(data => {
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
