/******************************************************************************
*
* Description: This module manages categories and Sort Methods to load data into 
* dropdown menu. Also helps keep dropdown data consistent 
*   
* Author(s): Brian Cheng 
*
******************************************************************************/

/* FUNCTION ".getRecent" WAS DELETED. REFER TO PREVIOUS COMMIT, 
   "Added my messages..." FOR REFERENCE IF NECESSARY.
   THIS FUNCTION MAY BE NEEDED FOR OUR HOME PAGE */

const db = require("../config/database");
const productsMiddleware = {};

productsMiddleware.loadMyPosts = (req, res, next) => {
  let userId = req.session.userId

  let baseSQL = "SELECT p.id, p.title, c.name, p.description, p.thumbnail, p.price, p.created, u.username \
    FROM categories c \
    JOIN products p \
    ON c.id = p.categoryId \
    JOIN users u \
    ON p.userId = u.id \
    WHERE u.id = ?";

  db.execute(baseSQL, [userId])
  .then(([results, fields]) => {
    if(results && results.length) {
      console.log(results);
    }
    else {
      console.log('Username does not exist')
    }
  })

  next();
}

productsMiddleware.manageCategories = (req, res, next) => {
  baseSQL = "SELECT id, name FROM categories ORDER BY name"
  db.execute(baseSQL, [])
  .then(([results, fields]) => {
    results.forEach(element => element["selected"] = false);
    res.locals.categories = results;
    next();
  })
  
}

productsMiddleware.manageSortMethods = (req, res, next) => {
  let sortMethods = [
    {
      id: 0,
      value: "",
      sortMethodName: "Price: Low to High",
      selected: false
    },
    {
      id: 1,
      value: "price-desc",
      sortMethodName: "Price: High to Low",
      selected: false
    }
  ]

  res.locals.sortMethods = sortMethods;
  next();
}

module.exports = productsMiddleware;
