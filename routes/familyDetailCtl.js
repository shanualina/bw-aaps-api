const express = require("express");
const router = express.Router();
const FAMILY_DETAILS = require("../models/familyDetails.model");
//create
router.post("/save", (req, res, next) => {
  const DETAILS = new FAMILY_DETAILS({
    userId: req.body.userId,
    FATHER_NAME: req.body.FATHER_NAME,
    FATHER_AGE: req.body.FATHER_AGE,
    MOTHER_AGE: req.body.MOTHER_AGE,
    WIFE_AGE: req.body.WIFE_AGE,
    MOTHER_NAME: req.body.MOTHER_NAME,
    WIFE_NAME: req.body.WIFE_NAME,
    CHILD_NAME1: req.body.CHILD_NAME1,
    CHILD_NAME2: req.body.CHILD_NAME2,
    CHILD_NAME3: req.body.CHILD_NAME3,
    CHILD_NAME4: req.body.CHILD_NAME4,
    CHILD_AGE1: req.body.CHILD_AGE1,
    CHILD_AGE2: req.body.CHILD_AGE2,
    CHILD_AGE3: req.body.CHILD_AGE3,
    CHILD_AGE4: req.body.CHILD_AGE4
  });
  DETAILS.save().then(result => {
    res.status(201).json({
      message: "User created!",
      status: 200
    });
  }).catch(err => {
    res.status(500).json({
      message: "Internal Server Error",
      error: err
    });
  });
});
//get api user id
router.get("/:userId", (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId)
  FAMILY_DETAILS.findOne({ userId: userId }).then(result => {
    console.log(result)
    if (!result) {
      res.status(404).send({
        status: 404,
        message: "Id Not Found!."
      });
    }
    else {
      res.status(200).send({
        status: 200,
        data: result
      })
    }

  }).catch(err => {
    console.log(err)
    res.status(500).json({
      message: "Internal Server Error",
      error: err
    });
  });
});
//update api
router.post("/update/:userId", (req, res, next) => {
  
  FAMILY_DETAILS.updateOne({ userId: req.params.userId }, req.body).then(result => {
    if (result) {
      res.status(200).json({ message: "Update successful!" });
    }
    else {
      res.status(404).json({ message: "Req Body Is Empty!" });
    }
  }).catch(err => {
    res.status(500).json({ message: "Unable To Process!" });
  });
});

//all reacord
//list with image done
router.get('/getall', async (req, res, next) => {
  try {
    const data = await FAMILY_DETAILS.find();
    if (data) {
      console.log(data)
      res.status(200).send({
        status: 200,
        data: data
      })
    }
    else {
      res.status(404).send({
        status: 404,
        message: "No Record Found!"
      })
    }

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Unable To Process!"
    })
  }
});

module.exports = router;
