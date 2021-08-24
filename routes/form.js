const express = require("express");
const Form = require("../models/form");
const RefrelModel = require("../models/refrelModel");
const multer = require("multer");
const { extname } = require('path');
const router = express.Router();
const request = require('request')
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "./images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(" ")
      .join("-");

    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, file.fieldname + "_" + Date.now() + extname(file.originalname))
  }
});

router.post("", multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");
  const form = new Form({
    imagePath: url + "/images/" + req.file.filename
  });
  form.save().then(createdPost => {
    console.log(createdPost);
    // res.status(201).json({
    //   message: "Post added successfully",
    //   post: {
    //     ...createdPost,
    //     id: createdPost._id
    //   }
    // });
  }).catch(err => {
    console.log(err);
  });
}
);
//create
router.post("/save", (req, res, next) => {
  const form = new Form({
    moNumber: req.body.moNumber,
    adharNumber: req.body.adharNumber,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    fatherName: req.body.fatherName,
    gender: req.body.gender,
    address1: req.body.address1,
    address2: req.body.address2,
    address3: req.body.address3,
    area: req.body.area,
    cast: req.body.cast,
    city: req.body.city,
    state: req.body.state,
    pincode: req.body.pincode,
    postal_area: req.body.postal_area,
    online_user: 0
  });
  form
    .save()
    .then(result => {
      res.status(201).json({
        message: "User created!",
        result: result
      });
    })
    .catch(err => {
      res.status(500).json({
        message: "Internal Server Error",
        error: err
      });
    });
});
//list with image done
router.get('/getall', async (req, res, next) => {
  try {
    let photofile = []
    const data = await Form.find();
    const results = await Promise.all(data.map(async posts => {
      posts = posts.toJSON();
      list = posts.imagePath;
      list.forEach(element => {
        let body = {
          photo: "https://" + req.headers.host + '/images/' + element.photo
        }
        photofile.push(body);
      });
      posts.imagePath = photofile
      photofile = [];
      return posts;
    }));
    res.send({
      data: results
    })
  } catch (error) {
    console.log(error);
  }
});

//update 
router.post("/update/:id", (req, res, next) => {
  var isUpdate=1;
  Form.updateOne({ _id: req.params.id }, req.body).then(result => {
    // console.log('23589999',result)
    Form.findOne({ _id: req.params.id }).then(result => {
          // console.log('578jjk',result.agreement)
          if(result.agreement == "accepted"){
            isUpdate=0;
            // if( result.referralPersoncode != result.referral_code){
            Form.findOne({
              referral_code: result.referralPersoncode
            }).then(response => {
              if (response) {
                RefrelModel.findOne({}).then(reffalAmount => {
                  let amount = 0;
                  totalAmont = 0
                  amount = + response.wallet_amount
                  totalAmont = amount + reffalAmount.REFRALAMOUNT;
      
                    Form.updateOne({
                      _id: response._id
                    }, {
                      wallet_amount: totalAmont,
      
                    }).then(response => {
                      // res.status(200).send({
                      //   data: result,
                      //   status: 200,
                      //   message: 'Verify Successfully',
                      // })
                    })
                
      
                })
              } else {
                // res.status(201).send({
                //   message: 'invalid referral Successfully',
                //   status: 201,
                //   data: data
                // })
              }
            })
          // }else{
            // console.log('invalid refrel code')
            // res.status(200).json({ message: "Invalid refrel code!" });
          // }
          }else{
           
          }  
    })
    if (result.ok && isUpdate==1) {
      res.status(200).json({ message: "Update successfull!" });
    }
    else {
      res.status(400).json({ message: "req body empty!" });
    }
  }).catch(err => {
    res.status(500).json({ message: "Unable To Process!" });
  });
});

//get otp
router.get('/getotp/:mobileNo', async (req, res, next) => {
  try {
    const mobileNo = req.params.mobileNo;
    Form.findOne({
      moNumber: mobileNo
    }).exec((err, user) => {
      var otpValue = Math.floor(1000 + Math.random() * 9000);
      var result = '';
      var characters = '123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';
      var charactersLength = characters.length;
      for (var i = 0; i < 8; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      if (!user) {
        const form = new Form({
          moNumber: req.params.mobileNo,
          otp: otpValue,
          referral_code: req.params.mobileNo,
          wallet_amount: 0
        });
        form.save().then(result => {
         // sendSMS(otpValue, mobileNo);
          res.status(200).send({
            status: 200,
            mobileNo: mobileNo,
            otp: otpValue,
          })
        })
      }
      else {
        var otpValue = Math.floor(1000 + Math.random() * 9000);
        Form.updateOne({
          moNumber: mobileNo
        }, {
          otp: otpValue,
        }).then(response => {
          console.log(response)
          if (response.ok == 1) {
          //  sendSMS(otpValue, mobileNo);
            res.status(201).send({
              status: 201,
              mobileNo: mobileNo,
              otp: otpValue,
            });
          }
        })
      }
    })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Unable To Process"

    })
  }
});
//verify otp
router.post('/verify_otp', async (req, res, next) => {
  try {
    // console.log(req.body.referral_code, 'kk')
    Form.updateOne({ moNumber:req.body.mobileNo }, {referralPersoncode:req.body.referral_code}).then(result => {
   
    const mobileNo = req.body.mobileNo
    Form.findOne({
      moNumber: mobileNo
    }).then(data => {
      // console.log(data)
      if (!data) {
        res.send({
          status: 3,
          message: "please try again."
        });
      } else {
       
          if(req.body.referral_code){
          if (req.body.referral_code != data.referral_code) {
            if (req.body.otp == data.otp) {
              res.status(200).send({
                status: 200,
                result:data,
                message: "Successfully verify"
              });
            }
            else {
              res.status(404).send({
                status: 404,
                message: "Miss Match Otp"
              });
            }
          } else {
            if (req.body.referral_code) {
              res.send({
                status: 3,
                message: "please try again."
              });
            }
          }
        }else{
           res.status(200).send({
            status: 200,
            result:data,
            message: "Successfully verify"
          });
        }
        // }
      }

    })
  })
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Unable To Process"

    })
  }

});

//get profile 26/07
router.get('/getprofile/:id', async (req, res, next) => {
  const id = req.params.id;
  let list = [];
  let photofile = [];
  Form.findOne({
    _id: id
  }).then(data => {
    if (!data) {
      res.status(404).send({
        status: 404,
        message: "Id Not Found!."
      });
    } else {
      list = data.imagePath;
      list.forEach(element => {
        let body = {
          photo: "https://" + req.headers.host + '/images/' + element.photo
        }
        console.log(body)
        photofile.push(body);
      });
      imagePath = photofile;
      photofile = [];
      const response = {
        adharNumber: data.adharNumber,
        firstName: data.firstName,
        middleName: data.middleName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        gender: data.gender,
        address1: data.address1,
        address2: data.address2,
        address3: data.address3,
        area: data.area,
        cast: data.cast,
        city: data.city,
        date_of_birth: data.date_of_birth,
        state: data.state,
        pincode: data.pincode,
        SKILLS: data.SKILLS,
        CORE_SKILLS: data.CORE_SKILLS,
        WORK_EXPERIENCE: data.WORK_EXPERIENCE,
        agreement: data.agreement,
        imagePath: imagePath,
        online_user: data.online_user,
        wallet_amount: data.wallet_amount,
        referral_code: data.referral_code
      }
      res.status(200).send({
        status: 200,
        data: response
      })
    }
  })
});
//image update
router.post("/imageupdate/:id", multer({ storage: storage }).array("images", 3), (req, res, next) => {
  let list = [];
  let photofile = [];
  list = req.files
  list.forEach(element => {
    const body = {
      photo: element.filename
    }
    photofile.push(body)
  })
  const form = {
    imagePath: photofile
  };
  Form.updateOne({ _id: req.params.id }, form).then(result => {
    if (result.ok) {
      res.status(200).json({
        status: 200,
        message: "Update successful!"
      });
    }
    else {
      res.status(401).json({
        status: 401,
        message: "Req Body Is Empty"
      });
    }
  }).catch(err => {
    res.status(500).json({
      status: 200,
      message: "Unable To Process!"
    });
  });
}
);
//verify reffral code  
router.post('/reffral', async (req, res, next) => {
 
  
  try {
    const referral = req.body.referral_code;
    Form.findOne({
      referral_code: referral
    }).then(data => {
      if (data) {
        res.status(200).send({
          status: 200,
          data: data,
          message: 'reffral code is valid',
        })
      } else {
        res.status(404).send({
          message: 'invalid referral!',
          status: 404,
        })
      }
    })

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Unable To Process"

    })
  }
});


// Dear Customer, please use OTP: (#var#) to verify your mobile number - Bharat Worker
router.post('/duplicateReffralcode', async (req, res, next) => {
  Form.findOne({
    moNumber: req.body.mobileNo,
    referralPersoncode: req.body.referral_code
  }).then(data => {
    if (data) {
      res.status(200).send({ message: "Reffral Code Already Exits" })
    }
    else {
      res.status(404).send({ message: "Not Found" })
    }
  })
})
//search by mobile no 
router.get('/search/:moNumber', async (req, res, next) => {
  try {
    const moNumber = req.params.moNumber;
    Form.findOne({
      moNumber: moNumber
    }).then(data => {
      if (data) {
        res.status(200).send({
          status: 200,
          data: data,
        })
      } else {
        res.status(404).send({
          message: 'mobile number not found!',
          status: 404,
        })
      }
    })

  } catch (error) {
    res.status(500).send({
      status: 500,
      message: "Unable To Process"

    })
  }
});

/// 'Use ' + otp + ' as OTP to login into your account. ' + msg,
function sendSMS(otp, msg) {
  var options = {
    'method': 'POST',
    'url': 'https://www.hellotext.live/vb/apikey.php?',
    form: {
      'apikey': 'RFepYFYAGxngDcC2',
      'senderid': 'BWPART',
      'templateid': '1207162745748341813',
      'number': '91' + msg,
      'message': 'प्रिय पार्टनर, कृपया मोबाईल वेरीफिकेशन के लिए ओटीपी: ' + otp + ' उपयोग करें - भारत वर्कर',
      'unicode': '2'
    }
    //  प्रिय पार्टनर, कृपया मोबाईल वेरीफिकेशन के लिए ओटीपी: '+ otp +' उपयोग करें - भारत वर्कर
    //   प्रिय पार्टनर, कृपया मोबाईल वेरीफिकेशन के लिए ओटीपी: 1603 उपयोग करें - भारत वर्कर
  };
  console.log(options)
  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(response.body);
    console.log(error)
  });

}
module.exports = router;