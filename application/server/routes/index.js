/******************************************************************************
*
* Description: Here is where we handle our front end routing. All of our
* get requests will be handled here.
*   
* Author(s): Brian Cheng 
*   
******************************************************************************/

const router = require('express').Router();
const loadMyPosts = require('../middleware/myPageMiddleware').loadMyPosts;
const loadMyMessages = require("../middleware/messagesMiddleware").loadMyMessages
const search = require('../middleware/searchMiddleware').search;
const db = require('../config/database');
const { userIsLoggedIn } = require('../middleware/routeProtectors');


// localhost:3000/
router.get('/', (req, res, next) => {
    res.render('index', {title: "GatorExpress"});
});

router.get('/login', (req, res, next) => {
    res.render('login', {title: "Log In"});
})

router.get('/registration', (req, res, next) => {
    res.render('registration', {title: "Register"});
})

router.get('/results', search, (req, res, next) => {
    res.render('results', {title: "Results"})
});

/* IF LOGGED CONDITION NEEEDED */
router.get('/post', userIsLoggedIn, (req, res, next) => {
    console.log('posts page');
    res.render('postItem', {title: "Post Item", onPost: true});
})

router.get('/about', (req, res, next) => {
    res.render('about', {title: "Team 3: CSC 648-03 Milestone 0", onAbout: true});
});

router.get('/map', (req, res, next) => {
    res.render('map', {title: "Campus Map", onMap: true});
})

router.get('/:myPage', userIsLoggedIn, loadMyPosts, loadMyMessages, (req, res, next) => {
    console.log(res.locals.myMessages)
    if (req.params.myPage == "myMessages")
        res.render('myPage', {title: "My Messages", onMyPage: true, messagesActive: true});
    if (req.params.myPage == "myPosts")
        res.render('myPage', {title: "My Posts", onMyPage: true, postsActive: true});
})


router.get('/product/:id', (req, res, next) => {
    let baseSQL = "SELECT p.id, u.username, p.title, p.description, p.photopath, p.price, p.created\
        FROM users u \
        JOIN products p \
        ON u.id = p.userId \
        WHERE p.id = ?";

    let productId = req.params.id;

    db.execute(baseSQL, [productId])
    .then(([results, fields]) => {
        if (results && results.length) {
            let product = results[0];
            res.render('individualPost', {currentProduct: product})
        } else {
            console.log('post no longer exists');
            res.redirect('/')
        }
    })
})

module.exports = router;