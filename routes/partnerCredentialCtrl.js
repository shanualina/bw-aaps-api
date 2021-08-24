const express = require("express");
const PARTNERCREDENTIALS = require("../models/partnerCredentials.model");
const PARTNERPROFILE = require("../models/partner_profile.model");
const REFFRALAMOUNT = require("../models/refrelModel");
const PARTNERDOCS = require("../models/partnerDocs.model");
const PARTNERSKILLS = require("../models/partnerSkills.model");
const multer = require("multer");
const { extname } = require('path');
const router = express.Router();
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

//get otp done
router.post("/getotp/:MONUMBER", async (req, res, next) => {
    try {
        const MONUMBER = req.params.MONUMBER;
        const exitsProfile = await PARTNERPROFILE.findOne({
            REFERRALCODE: MONUMBER,
            REFFREDBY: req.body.REFFREDBY
        })
        console.log(exitsProfile)
        if (!exitsProfile) {
            const EXITESRECORD = await PARTNERCREDENTIALS.findOne({ MONUMBER: MONUMBER })
            if (!EXITESRECORD) {
                var OTPVALUE = Math.floor(1000 + Math.random() * 9000);
                const PARTNERCREDENTIAL = await new PARTNERCREDENTIALS({
                    MONUMBER: MONUMBER,
                    LOGINTYPE: "general",
                    STATUS: 1,
                    OTP: OTPVALUE
                });
                PARTNERCREDENTIAL.save()
                const profileCreates = await PARTNERPROFILE({
                    UID: PARTNERCREDENTIAL._id,
                    REFERRALCODE: MONUMBER,
                    CONTACT_NUMBER: MONUMBER,
                    WALLENTAMOUNT: 0,
                    REFFREDBY: req.body.REFFREDBY
                })
                profileCreates.save()
                const referralAmount = await REFFRALAMOUNT.findOne({})
                const FINDPROFILE = await PARTNERPROFILE.findOne({
                    REFFREDBY: req.body.REFFREDBY
                })
                if (FINDPROFILE) {
                    let AMOUNT = 0;
                    TOTALAMOUNT = 0;
                    AMOUNT = + FINDPROFILE.WALLENTAMOUNT
                    TOTALAMOUNT = AMOUNT + referralAmount.REFRALAMOUNT;
                    const profileupdate = await PARTNERPROFILE.updateOne({
                        REFERRALCODE: req.body.REFFREDBY
                    }, {
                        WALLENTAMOUNT: TOTALAMOUNT,
                    })
                    console.log(profileupdate)
                }


                return res.status(200).json({
                    STATUS: 200,
                    RESULTS: PARTNERCREDENTIAL,
                    MESSAGE: "User Registred successfully"
                })
            }
            else {
                var OTPVALUE = Math.floor(1000 + Math.random() * 9000);
                const UPDATERECORD = await PARTNERCREDENTIALS.updateOne({
                    MONUMBER: MONUMBER,
                }, {
                    OTP: OTPVALUE,
                })
                return res.status(201).json({
                    STATUS: 201,
                    MONUMBER: MONUMBER,
                    OTP: OTPVALUE,
                });
            }
        }
        var OTPVALUE = Math.floor(1000 + Math.random() * 9000);
        const UPDATERECORD = await PARTNERCREDENTIALS.updateOne({
            MONUMBER: MONUMBER,
        }, {
            OTP: OTPVALUE,
        })
        if (!UPDATERECORD) {

        }
        return res.status(208).json({
            STATUS: 208,
            OTP: OTPVALUE,
            MESSAGE: "reffral code alaready exits"
        });

    } catch (error) {
        console.log(error)
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
    }
});

//verify otp
router.post('/verify_otp', async (req, res, next) => {
    try {
        const MONUMBER = req.body.MONUMBER
        const findExits = await PARTNERCREDENTIALS.findOne({
            MONUMBER: MONUMBER
        })
        if (!findExits) {
            res.send({
                status: 404,
                message: "mobile no not found please try again."
            });
        } else {
            if (req.body.OTP == findExits.OTP) {
                const data = await PARTNERCREDENTIALS({
                    MONUMBER: MONUMBER
                }, {
                    DEVICE_ID: req.body.DEVICE_ID,
                    DEVICE_TYPE: req.body.DEVICE_TYPE,
                    NOTIFICATION_TOKEN: req.body.NOTIFICATION_TOKEN,
                    APP_TOKEN: req.body.APP_TOKEN
                })
                return res.status(200).send({
                    status: 200,
                    result: findExits,
                    message: "Successfully verify"
                });
            }
            return res.status(404).send({
                status: 404,
                message: "Miss Match Otp"
            });
        }
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Unable To Process"

        })
    }

});

//shanoo vishwakarma
router.post('/update/:UID', multer({ storage: storage }).single('image'), async (req, res, next) => {
    try {
        if (req.file) {
            const updatefile = await PARTNERPROFILE.updateOne(
                {
                    UID: req.params.UID
                }, { PRORFILEPIC: 'images/' + req.file.filename }
            )

            if (updatefile.ok == 1) {
                return res.status(200).send({
                    STATUS: 200,
                    MESSAGE: "update successfully"
                })
            } else {
                return res.status(304).send({
                    STATUS: 304,
                    MESSAGE: "Not modified"
                })
            }
        }
        else {
            const updatefile = await PARTNERPROFILE.updateOne({ UID: req.params.UID }, req.body)
            if (updatefile.ok == 1) {
                return res.status(200).send({
                    STATUS: 200,
                    MESSAGE: "update successfully"
                })
            } else {
                return res.status(304).send({
                    STATUS: 304,
                    MESSAGE: "Not modified"
                })
            }
        }




    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }

});
//ALL USER RECORD
router.get('/getall', async (req, res, next) => {
    try {
        const data = await PARTNERCREDENTIALS.find({});
        const results = await Promise.all(data.map(async posts => {
            const posts1 = posts.toJSON();
            posts1.profile = await PARTNERPROFILE.find({ UID: posts1._id })
            posts1.profile[0].PRORFILEPIC = "https://" + req.headers.host + '/images/' + posts1.profile[0].PRORFILEPIC
            posts1.document = await PARTNERDOCS.find({ UID: posts1._id })
            posts1.document.DOCUMENT_PATH = "https://" + req.headers.host + '/images/' + posts1.document.DOCUMENT_PATH
            console.log( posts1._id )
            posts1.skills = await PARTNERSKILLS.find({ UID: posts1._id })
            return posts1;
        }));
        if (!results) {
            res.status(404).send({
                STATUS: 404,
                DATA: results
            })
        }
        res.status(200).send({
            STATUS: 200,
            DATA: results
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }
});
//get profile info
router.get('/getProfile/:id', async (req, res, next) => {
    try {
        const data = await PARTNERCREDENTIALS.findOne({ _id: req.params.id });
        const profile = await PARTNERPROFILE.findOne({ UID: req.params.id })
        const object = {
            "_id": data._id,
            "USERNAME": data.USERNAME,
            "PASSWORD": data.PASSWORD,
            "DEVICE_ID": data.DEVICE_ID,
            "DEVICE_TYPE": data.DEVICE_TYPE,
            "EMAIL": data.EMAIL,
            "MONUMBER": data.MONUMBER,
            "LOGINTYPE": data.LOGINTYPE,
            "STATUS": data.STATUS,
            "UID": profile.UID,
            "REFERRALCODE": profile.REFERRALCODE,
            "CONTACT_NUMBER": profile.CONTACT_NUMBER,
            "WALLENTAMOUNT": profile.WALLENTAMOUNT,
            "REFFREDBY": profile.REFFREDBY,
            "FIRSTNAME": profile.FIRSTNAME,
            "PRORFILEPIC": "https://" + req.headers.host + '/images/' + profile.PRORFILEPIC,
            "MIDDLENAME": profile.MIDDLENAME,
            "LASTNAME": profile.LASTNAME,
            "ADDRESS": profile.ADDRESS,
            COUNTRY: profile.COUNTRY,
            STATE: profile.STATE,
            CITY: profile.CITY,
            PINCODE: profile.PINCODE,
            DOB: profile.DOB
        }
        res.send({
            data: object
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }
});
//upload document 
router.post('/createdoc', multer({ storage: storage }).array('image', 5), async (req, res, next) => {
    try {
        let list = [];
        list = req.files
        list.forEach(element => {
            const doc = new PARTNERDOCS({
                UID: req.body.UID,
                DOCUMENT_PATH: 'images/' + element.filename,
                CREATEDBY: req.body.UID,
                UPDATEDBY: req.body.UID,
                CREATEDAT: Date.now(),
                UPDATEDAT: Date.now(),
            })
            doc.save()
        })
        return res.status(200).send({
            STATUS: 200,
            MESSAGE: "create successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }

});

//get docment
router.get('/getdoc/:UID', async (req, res, next) => {
    try {
        const data = await PARTNERDOCS.find({ UID: req.params.UID })
        const results = await Promise.all(data.map(async posts => {
            posts = posts.toJSON();
            posts.DOCUMENT_PATH = "https://" + req.headers.host + '/images/' + posts.DOCUMENT_PATH
            return posts;
        }))
        if (!results) {
            return res.status(404).send({
                STATUS: 404,
                MESSAGE: "no record found"
            })
        }
        return res.status(200).send({
            STATUS: 200,
            DATA: results
        })
    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }
});
//add skills
router.post('/addskills', async (req, res, next) => {
    try {
        const ExitsSkills = await PARTNERSKILLS.findOne({ UID: req.body.UID })
        if (!ExitsSkills) {
            const skills = new PARTNERSKILLS({
                UID: req.body.UID,
                CORE_SKILLS: req.body.CORE_SKILLS,
                SKILLS: req.body.SKILLS,
                WORK_EXPERIENCE: req.body.WORK_EXPERIENCE,
                STATUS: req.body.STATUS,
            })
            const data = await skills.save()
            if (!data) {
                return res.status(404).send({
                    STATUS: 404,
                    MESSAGE: "req body is emptry"
                })
            }
            return res.status(200).send({
                STATUS: 200,
                DATA: data
            })
        }
        return res.status(208).send({
            STATUS: 208,
            MESSAGE: "skills already exits"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            status: 500,
            message: "Unable To Process"
        })
    }
});

router.post('/checkreffral', async (req, res, next) => {
    try {
        const REFERRALCODE = req.body.REFERRALCODE;
        const exits = await PARTNERCREDENTIALS({ MONUMBER: req.body.MONUMBER })
        PARTNERPROFILE.findOne({
            REFERRALCODE: REFERRALCODE
        }).then(data => {
            console.log(data)
            if (data.REFERRALCODE == exits.MONUMBER) {
                res.status(404).send({
                    MESSAGE: 'invalid referral!',
                    STATUS: 404,
                })
            } else {
                res.status(200).send({
                    STATUS: 200,
                    MESSAGE: 'reffral code is valid',
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
//get skillas
router.get('/getskills', async (req, res, next) => {
    try {
        const skills = await PARTNERSKILLS.find({ UID: "612471da61d8858764eac0e7" })
        if (!skills) {
            res.status(404).send({
                MESSAGE: 'No record found',
                STATUS: 404,
            })
        } else {
            res.status(200).send({
                STATUS: 200,
                DATA: skills,
            })
        }

    } catch (error) {
        res.status(500).send({
            status: 500,
            message: "Unable To Process"

        })
    }
});


const request = require('request');
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

