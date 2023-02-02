var express = require('express');
const router = express.Router();
const { successPrint, errorPrint } = require("../helpers/debug/debugprinters");
const { create } = require('../models/Messages');

router.post('/create', (req, res, next) => {

    if (!req.session.username) {
        errorPrint("must be logged in to message");
        res.json({
            code: -1,
            status: "danger",
            message: "Must be logged in to create a message"
        });
    } else {
        let { message, productId } = req.body;
        let username = req.session.username
        let userId = req.session.userId
        create(userId, productId, message)
            .then((wasSuccessful) => {
                if (wasSuccessful != -1) {
                    successPrint(`message was created for ${username}`);
                    res.json({
                        code: 1,
                        status: "success",
                        message: "message created",
                        messageText: message,
                        username: username
                    })
                    
                } else {
                    errorPrint('message was not saved');
                    res.json({
                        code: -1,
                        status: "danger",
                        message: "message was not created"
                    })
                }
            }).catch((err) => next(err));
    }

})

module.exports = router;