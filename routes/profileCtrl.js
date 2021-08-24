const express = require("express");
const PROFILE=require('../models/profileModel');
const multer = require('multer');
const router = express.Router();
var path = require('path');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/profile');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });
// var upload = multer({ storage: storage })
router.post('/save', (req, res) => {
    let upload = multer({
      storage: storage,
      limits: { fileSize: 1024 * 1024 * 100 }, fileFilter: function (req, file, callback) {
          checkFileType(file, callback);
          let type = file.mimetype.toLowerCase();
          if (type.includes('image')) {
              callback(null, true)
          }
          else {
              return res.json({ success: false, message: "Some thing went wrong" });
          }
      }
  }).fields(
      [
          {
              name: 'profile_image', maxCount: 1
          },
      ]
  );
  function checkFileType(file, cb) {
      
       if (file.fieldname === "profile_image") {
          if (
              file.mimetype === 'image/png' ||
              file.mimetype === 'image/jpg' ||
              file.mimetype === 'image/jpeg' ||
              file.mimetype === 'image/gif' 
          ) { // check file type to be png, jpeg, or jpg
              cb(null, true);
          } else {
              cb(null, false); // else fails
          }
      }
  }
  
  upload(req, res, function (err) {
      if (err) {
          return err;
      }
      if (req) {
        let file_name=req.files.profile_image[0].filename
     const profile = new PROFILE({
         USER_ID: req.body.USER_ID,
         IMAGE_PATH: file_name,
     });
     profile.save()
     .then(result => {
       res.status(201).json({
         data: result
       });
     });
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
  router.get('/getByID/:id',(req,res,next) =>{
    PROFILE.find({ USER_ID: req.params.id}).then(post => {
        if (post) {
          res.status(200).json(post);
        } else {
          res.status(404).json({ message: "Post not found!" });
        }
      }).catch((err) => {
        res.send({
            ERROR: err,
            STATUS: 0
        })
    });
  })
//   team leader name,total team member,team leader moblke num
  module.exports = router;