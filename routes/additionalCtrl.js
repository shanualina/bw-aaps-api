const express = require("express");
const multer = require("multer");
const { extname } = require('path');
const router = express.Router();

const Additional = require("../models/additional.model");
const additionalDocumnetModel = require("../models/additionalDocumnet.model");
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


//create
router.post("/save", async (req, res, next) => {
    try {
        const additional = new Additional({
            name: req.body.name,
            name_hindi:req.body.name_hindi,
            status: req.body.status
        });
        const add = await additional.save()
        if (!add) {
            return res.status(400).json({
                status: 400,
                message: "bad request!"
            });

        }
        return res.status(200).json({
            message: "additinal doc name add sucessfully!",
            status: 200
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500
        });
    }
});
//list with image done
router.get('/getall', async (req, res, next) => {
    try {
        const data = await Additional.find();
        if (!data) {
            return res.status(404).send({
                status: 404,
                message: "no record found!"
            })
        }
        return res.status(200).send({
            status: 200,
            data: data
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500
        });
    }
});
//update 
router.post("/update/:id", async (req, res, next) => {
    try {
        const Additional = await Additional.updateOne({ _id: req.params.id }, req.body)
        if (!Additional.ok) {
            return res.status(400).json({ message: "req body empty!", status: 400 });
        }
        return res.status(200).json({ message: "Update successful!", status: 200 });
    } catch (error) {
        return res.status(500).json({ message: "Unable To Process!", status: 500 });
    }
})
//add doc 
router.post("/adddoc", multer({ storage: storage }).single("image"), async (req, res, next) => {
    try {
        var datetime = new Date();
        const add = await additionalDocumnetModel.create({
            userId: req.body.userId,
            docId: req.body.docId,
            docImage: req.file.filename,
            date: datetime,
            status: req.body.status
        })
        if (!add) {
            return res.status(400).json({
                status: 400,
                message: "bad request!"
            });
        }
        return res.status(200).json({
            message: "doc add sucessfully!",
            status: 200
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500
        });
    }
});
//doc list by user id
router.get('/getdoc/:userId', async (req, res, next) => {
    try {
        const data = await additionalDocumnetModel.find({ userId: req.params.userId });
        const results = await Promise.all(data.map(async posts => {
            posts = posts.toJSON();
            posts.additional = await Additional.find({ _id: posts.docId })
            posts.docImage = "https://" + req.headers.host + '/images/' + posts.docImage
            return posts;
        }));
        if (!results) {
            return res.status(404).send({
                status: 404,
                message: "no record found!"
            })
        }
        return res.status(200).send({
            status: 200,
            data: results
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error",
            status: 500
        });
    }
});
module.exports = router;