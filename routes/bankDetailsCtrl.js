const express = require("express");
const BANKDETAILS = require("../models/bankDetailsModel");

const router = express.Router();

router.post('/save', (req, res, next) => {
  const bank = new BANKDETAILS({
    userId: req.body.userId,
    ACOOUNT_NUMBER: req.body.ACOOUNT_NUMBER,
    IFSC: req.body.IFSC,
    ACCOUNT_HOLDER_NAME: req.body.ACCOUNT_HOLDER_NAME,
    PHONE_NUMBER: req.body.PHONE_NUMBER
  });
  bank.save()
    .then(result => {
      res.status(201).json({
        data: result
      });
    });
});


router.post("/update/:id", (req, res, next) => {
  const bankDetailsUpdate = {
    ACOOUNT_NUMBER: req.body.ACOOUNT_NUMBER,
    IFSC: req.body.IFSC,
    ACCOUNT_HOLDER_NAME: req.body.ACCOUNT_HOLDER_NAME,
    PHONE_NUMBER: req.body.PHONE_NUMBER
  };
  BANKDETAILS.updateOne({ _id: req.params.id }, bankDetailsUpdate).then(result => {
    res.status(200).json({ message: "Update successful!" });
  }).catch(err => {
    console.log(err);
    res.send(err);
  });
});


router.get("/getAll", (req, res, next) => {
  BANKDETAILS.find().then(data => {
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

router.get("/get/:id", (req, res, next) => {
  BANKDETAILS.find({ _id: req.params.id }).then(data => {
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

router.get("/:userId", (req, res, next) => {
  BANKDETAILS.find({ userId: req.params.userId }).then(data => {
    console.log(data)
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
