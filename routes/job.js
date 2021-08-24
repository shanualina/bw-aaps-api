const express = require("express");
const JOBS = require("../models/jobs");
const jobWorkArea = require("../models/jobWorkArea");
const skillSets = require("../models/skillSets");
const router = express.Router();

router.get('/get/all/jobs', (req, res, next) => {
  JOBS.find()
    .then(documents => {
      res.status(201).json({
        message: "Data Fetched!",
        formData: documents
      });
    });
});

router.get("/:id", (req, res, next) => {
  JOBS.find({ _id: req.params.id }).then(data => {
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

router.post('/save/skill', (req, res, next) => {
  const job = new JOBS({
    JOB_NAME: req.body.JOB_NAME,
    JOB_NAME_HINDI: req.body.JOB_NAME_HINDI,
    STATUS: req.body.STATUS
  });
  job.save()
    .then(documents => {
      res.status(201).json({
        formData: documents
      });
    });
});


router.post("/update/skills/:id", (req, res, next) => {
  const skills = {
    JOB_NAME: req.body.JOB_NAME,
    JOB_NAME_HINDI: req.body.JOB_NAME_HINDI,
    STATUS: req.body.STATUS
  };
  JOBS.updateOne({ _id: req.params.id }, skills).then(result => {
    res.status(200).json({ message: "Update successful!" });
  }).catch(err => {
    console.log(err);
  });
});
//shanoo vishwakarma
//remove jobs 
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const resultes = await JOBS.deleteOne({ _id: id })
    if (!resultes) {
      return res.status(404).json({
        status: 404,
        message: "id not found!"
      });
    }
    else {
      const res1 = await jobWorkArea.deleteMany({ JOB_UID: id })
      if (res1) {
        const res2 = await skillSets.deleteMany({ CORE_SKILL_ID: id })
        return res.status(200).json({
          status: 200,
          message: "delete successful!"
        });
      }

    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Unable To Process!"
    })
  }
})



module.exports = router;

