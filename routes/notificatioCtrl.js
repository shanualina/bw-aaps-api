const express = require("express");
const  NOTIFICATION = require("../models/notificationModel");
const multer = require('multer');
const router = express.Router();
var path = require('path');
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, './public');
  },
 
  filename: function(req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});


  router.post("/update/:id", (req, res, next) => {
    NOTIFICATION.updateOne({ _id: req.params.id},  req.body).then(result => {
      res.status(200).json({ message: "Update successful!" });
    }).catch(err => {
      console.log(err);
      res.send(err);
    });
  });


  router.get("/getAll", (req, res, next) => {
     let imageArr=[]
    NOTIFICATION.find().then(data => {
        if (data) {
          res.status(200).json(data);
        } else {
          res.status(404).json({ message: "Data not found!" });
        }
      }).catch((err) => {
          console.log(err)
        res.send({
            ERROR: err,
            STATUS: 0
        })
    });
});
// var upload = multer({ storage: storage })
router.post('/save', (req, res) => {
  let upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 100 }, fileFilter: function (req, file, callback) {
        checkFileType(file, callback);
        let type = file.mimetype.toLowerCase();
        if (type.includes('image') || type.includes('video')) {
            callback(null, true)
        }
        else {
            return res.json({ success: false, message: "Some thing went wrong" });
        }
    }
}).fields(
    [
        {
            name: 'multi_image', maxCount: 10
        },
    ]
);
function checkFileType(file, cb) {
    // console.log('23456765678', file.fieldname)
    if (file.fieldname === "certificate") {
        if (
            file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/msword' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ) { // check file type to be pdf, doc, or docx
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
    else if (file.fieldname === "multi_image") {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'image/gif' ||
            file.mimetype === 'video/gif' ||
            file.mimetype === 'video/mp4' ||
            file.mimetype === 'video/ogg' ||
            file.mimetype === 'video/wmv' ||
            file.mimetype === 'video/x-flv' ||
            file.mimetype === 'video/avi'   ||
            file.mimetype === 'video/webm' ||
            file.mimetype === 'video/mkv' ||
            file.mimetype === 'video/avchd' ||
            file.mimetype === 'video/mov'
        ) { // check file type to be png, jpeg, or jpg
            cb(null, true);
        } else {
            cb(null, false); // else fails
        }
    }
}

upload(req, res, function (err) {
    //   console.log(req.body);
    // req.file contains information of uploaded file
    // req.body contains information of text fields, if there were any
    if (err) {
        return err;
    }
    if (req) {
      let file_name=[];
      for(let i=0;i<req.files.multi_image.length;i++){
        file_name.push(req.files.multi_image[i].filename)
      }
      // console.log(file_name.length);
      //  =req.files.multi_image[0].filename;
      //  console.log(req.files.multi_image.length,file_name);
       var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
       indiaTime = new Date(indiaTime);
   var dateTime = indiaTime.toLocaleString();
   if(file_name.length > 0 ){
   const notification = new NOTIFICATION({
       NAME: req.body.NAME,
       NEED: req.body.NEED,
       COST: req.body.COST,
       TOTAL_AMOUNT:  req.body.COST,
       ADDRESS: req.body.ADDRESS,
       FILE_NAME:file_name,
       FILE_STATUS : req.body.FILE_STATUS,
       STATUS: 1,
       DATE:dateTime
   });
   notification.save()
   .then(result => {
     res.status(201).json({
       data: result
     });
   });
  }

    }
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (req.file == "undefined") {
        return res.send('Please select an image to upload');
    }
    else if (err instanceof multer.MulterError) {
        return res.send(err);
    }
    else if (err) {
        return res.send(err);
    }

    // Display uploaded image for user validation
    // res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
});
})
  module.exports = router;
