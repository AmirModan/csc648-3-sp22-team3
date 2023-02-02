const db = require('../config/database');
const postValidation = {};

const checkTitle = (title) => {
    let titleChecker = /^ *$/;
    return titleChecker.test(title);
}

const checkCategory = (category) => {
    return (category === "Select:")
}

module.exports = postValidation;