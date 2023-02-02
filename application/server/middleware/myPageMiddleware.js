/******************************************************************************
*
* Description: This Middleware function Will handle passing data from messages
* and posts database for Express to render myPage 
*  
* Author(s):
*
******************************************************************************/
const db = require("../config/database");
const myPageMiddleware = {};

myPageMiddleware.loadMyPosts = (req, res, next) => {
  //user that is signed in
  let userId = req.session.userId

  let baseSQL =
    "SELECT p.id, p.title, c.name, p.description, p.thumbnail, p.price, p.created, u.username \
      FROM categories c \
      JOIN products p \
      ON c.id = p.categoryId \
      JOIN users u \
      ON p.userId = u.id \
      WHERE u.id = ?";

  db.execute(baseSQL, [userId])
    .then(([results, fields]) => {
      res.locals.myPostCards = results;
      res.locals.myPosts = results;
      if (results && results.length == 0) {
        console.log("no posts yet");
      }
      next();
    })
    .catch((err) => console.log(err));
};

module.exports = myPageMiddleware;