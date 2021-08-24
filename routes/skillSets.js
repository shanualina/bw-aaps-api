const express = require("express");
const SKILL = require("../models/skillSets");
const jobWorkArea = require("../models/jobWorkArea");
const router = express.Router();

router.get("/get/all/workExpe", (req, res, next) => {
  SKILL.find().then(data => {
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

router.get("/:id", (req, res, next) => {
  SKILL.find({ CORE_SKILL_ID: req.params.id }).then(data => {
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ message: "Skill not found!" });
    }
  }).catch((err) => {
    console.log(err);
  });
});
//shanoo vishwakarma
router.post('/save/expe', async (req, res, next) => {
  try {
    const skill = new SKILL({
      CORE_SKILL_ID: req.body.CORE_SKILL_ID,
      STATUS: req.body.STATUS,
      WORK_EXPE: req.body.WORK_EXPE,
      WORK_EXPE_HINDI: req.body.WORK_EXPE_HINDI
    });
    const documents = await skill.save()
    if (!documents) {
      return res.status(204).json({
        status: 204,
        message: "req body is empty"
      });
    }
    return res.status(201).json({
      status: 201,
      formData: documents
    });

  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: "unable to process"
    });
  }
});

router.post("/update/:id", (req, res, next) => {
  const skillsUpdate = {
    CORE_SKILL_ID: req.body.CORE_SKILL_ID,
    STATUS: req.body.STATUS,
    WORK_EXPE: req.body.WORK_EXPE,
    WORK_EXPE_HINDI: req.body.WORK_EXPE_HINDI
  };
  SKILL.updateOne({ _id: req.params.id }, skillsUpdate).then(result => {
    res.status(200).json({ message: "Update successful!" });
  }).catch(err => {
    console.log(err);
  });
});

//shanoo vishwakarma
router.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const resultes = await jobWorkArea.findOne({ _id: id })
    if (!resultes) {
      const res1 = await skillSets.deleteMany({ CORE_SKILL_ID: id })
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
      message: "work id found in skill first then delete " + resultes.WORK_AREA_HINDI
    });
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: "Unable To Process!"
    })
  }
})


module.exports = router;

