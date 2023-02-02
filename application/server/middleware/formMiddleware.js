const db = require('../config/database');
const formMiddleware = {};

formMiddleware.setPostButton = (req, res, next) => {
    res.locals.postFailed = true;
    next();
}

module.exports = formMiddleware;