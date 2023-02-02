const checkUsername = (username) => {            
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);
};
const checkPassword = (password) => {
    let passwordChecker = /(?=.*?[A-Z])\d*?(?=.*?[\/*-+!@#$^&*]).{8,}$/;
    return passwordChecker.test(password);
};

const checkEmail = (email) => {
    let emailChecker = /[^@ \t\r\n]+@[^@ \t\r\n]+\.[@sfsu.edu]+$/
    return emailChecker.test(email);
};

const passwordsMatched = (password, confirmPassword) => {
    if (password == confirmPassword) {
        return true;
    }
    return false;
}

const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    let confirmPassword = req.body.confirmPassword;
    console.log(username, password, email, confirmPassword)
    if (!checkUsername(username)) {
        req.flash('error', "invalid username!!!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!checkPassword(password)) {
        req.flash('error', "invalid password!!!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!checkEmail(email)) {
        req.flash('error', "invalid email!!!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if (!passwordsMatched(password, confirmPassword)) {
        req.flash('error', "passwords need to match!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    }
    else {
        next();
    }
}

const loginValidator = (req, res, next) => {
    
}

module.exports = { registerValidator, loginValidator };