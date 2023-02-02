/******************************************************************************
* 
* Description: This is where we handle our products route. Post requests
* for Users are handled here.
*   
* Author(s): Brian Cheng
*
******************************************************************************/

const router = require('express').Router();
const db = require('../config/database');
const sharp = require('sharp');
const multer = require('multer');
const crypto = require('crypto');
const { strictEqual } = require('assert');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets/img/upload");
    },
    filename: (req, file, cb) => {
        let fileExt = file.mimetype.split('/')[1];
        let randomName = crypto.randomBytes(22).toString("hex");
        cb (null, `${randomName}.${fileExt}`)
    }
})

var uploader = multer({storage: storage});

router.post('/upload', uploader.single("imgUpload"), (req, res, next) => {
    let title = req.body.productTitle;
    let category = req.body.productCategory;
    let price = Number.parseFloat(req.body.productPrice).toFixed(2);
    let description = req.body.productDesc;

   
    let userId = req.session.userId;

    /* Ensures fields are not undefined or invalid so we
       Don't receive any corrupt data */
    
    // No Title
    if (title.match(/^ *$/) !== null) {
        console.log('Please enter a title');
        res.redirect('/post');
        return;
    }

    // No Category
    if (category === "Select:") {
        console.log('Please select a category');
        res.redirect('/post');
        return;
    }

    // No Price
    if (!/^\d+(\.\d{2})$/.test(price)) {
        console.log('Please enter a valid price');
        res.redirect('/post');
        return;
    }
    if (description.match(/^ *$/) !== null) {
        console.log('Please enter a description');
        res.render('postItem');
        return;
    }

    // No File
    if (req.file === undefined) {
        console.log('please upload a photo')
        res.redirect('/post');
        return;
    }

    let fileUploaded = req.file.path;
    let fileAsThumbnail = `thumbnail-${req.file.filename}`;
    let destinationOfThumbnail = req.file.destination + "/" + fileAsThumbnail;

    sharp(fileUploaded)
    .resize(300, 275)
    .toFile(destinationOfThumbnail)
    .then(() => {
        let baseSQL = "INSERT INTO products (title, description, categoryId, \
        photopath, thumbnail, created, userId, price, status) VALUE (?, ?, ?, ?, ?, now(), ?, ?, 0);"
        return db.execute(baseSQL, [title, description, category,
            fileUploaded, destinationOfThumbnail, userId, price])
    })
    .then(([results, fields]) => {
        if(results && results.affectedRows) {
            console.log('success');
            // req.flash
            res.redirect('/');
        }
        else {
            console.log('error');
        }
    })
    .catch((err) => console.log(err))
    
})

module.exports = router;