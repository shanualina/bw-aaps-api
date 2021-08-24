const express = require("express");
const JOBS = require("../models/jobs");
const jobWorkArea = require("../models/jobWorkArea");
const router = express.Router();

router.get('/get/all/jobsWorkArea', (req, res, next) => {
  jobWorkArea.find()
    .then(documents => {
      res.status(201).json({
        message: "Data Fetched!",
        formData: documents
      });
    });
});

router.get("/:id", async (req, res, next) => {
  const id = req.params.id
  try {
    const post = await jobWorkArea.find({ JOB_UID: id })
    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }
    return res.status(200).json(post);

  } catch (error) {
    res.status(500).send({
      message: "Unable to process"
    })
  }
});

router.post('/save/coreSkills', async (req, res, next) => {
  try {
    const jobWork = new jobWorkArea({
      JOB_UID: req.body.JOB_UID,
      STATUS: req.body.STATUS,
      WORK_AREA: req.body.WORK_AREA,
      WORK_AREA_HINDI: req.body.WORK_AREA_HINDI
    });
    const documents = await jobWork.save()
    if (!documents) {
      return res.status(204).json({
        message: "req body is empty"
      });
    }
    return res.status(201).json({
      status: 201,
      formData: documents
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "unale to process"
    })
  }
});

router.post("/update/:id", (req, res, next) => {
  const workjobs = {
    JOB_UID: req.body.JOB_UID,
    STATUS: req.body.STATUS,
    WORK_AREA: req.body.WORK_AREA,
    WORK_AREA_HINDI: req.body.WORK_AREA_HINDI
  };
  jobWorkArea.updateOne({ _id: req.params.id }, workjobs).then(result => {
    res.status(200).json({ message: "Update successful!" });
  }).catch(err => {
    console.log(err);
  });
});
//shanoo vishwakarma
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const resultes = await JOBS.findById({ _id: id })
    console.log(resultes)
    if (!resultes) {
      const res1 = await jobWorkArea.deleteMany({ JOB_UID: id })
      if (!res1) {
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
    return res.status(208).json({
      status: 208,
      message: "Job id found in job delete first then delete " + resultes.JOB_NAME
    });

  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Unable To Process!"
    })
  }
})

module.exports = router;

