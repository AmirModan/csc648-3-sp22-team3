/******************************************************************************
* 
* Description: This module handles the search function which grabs info from
* the database and renders the results page upon a search request
*   
* Author(s): Brian Cheng
*
******************************************************************************/

const db = require('../config/database');
const searchMiddleware = {}
var isLoggedIn = require('../middleware/routeProtectors').userIsLoggedIn;

// Search term can never go over 40 characters
const SEARCH_CHAR_LIMIT = 40;

/* Depending on which search method we use, query will adjust */
function setQuery(status) {
    let baseSQL =
        "SELECT p.id, p.title, c.name, p.description, p.thumbnail, p.price, p.created, u.username, p.status \
        FROM categories c \
        JOIN products p \
        ON c.id = p.categoryId \
        JOIN users u \
        ON p.userId = u.id";

    switch (status) {
        case "searchAndCategory":
            return baseSQL.concat(" ", "HAVING concat_ws(' ', p.title, p.description) LIKE ? AND c.name LIKE ? AND p.status=1");
        case "searchTermOnly":
            return baseSQL.concat(" ", "HAVING concat_ws(' ', p.title, p.description) LIKE ? AND p.status=1");
        case "categoryOnly":
            return baseSQL.concat(" ", "HAVING c.name LIKE ? AND p.status=1");
        default:
            return baseSQL.concat(" ",  "WHERE p.status=1")
    }
}

/* Appends "ORDER BY" clause to base query */
function insertSort(query, sortMethod) {
    switch(sortMethod) {
        case "price-desc":
            return query.concat(" ", "ORDER BY price DESC");
        default:
            return query.concat(" ", "ORDER BY price");
    }
}

/* Back-end Search Limit; used in case front end part does not work */
function maxSearchLength(searchTerm, max) {
    if (searchTerm && searchTerm.length > max) {
        return searchTerm.substring(0, max)
    }
    return searchTerm;
} 

/* Middleware will run before we use routers */
searchMiddleware.setSearchLimit = (req, res, next) => {
    res.locals.searchLimit = SEARCH_CHAR_LIMIT;
    next();
}

/* This middleware function will run before rendering the results page*/
searchMiddleware.search = (req, res, next) => {
    // From hbs files according to name attribute. Values loaded upon search
    let searchTerm = "";
    let category = req.query.category;

    // Ensures that sort is not undefined; handled outside results page
    let sort = "";
    if (req.query.sort !== undefined) {
        sort = req.query.sort;
    }


    // Checks if search term is alpha numeric
    if (req.query.search) {
        if (!(/^[a-z\d\ *]+$/i).test(req.query.search)) {
            console.log('Not alphanumeric. Please enter alphanumeric characters only');
        }
        else {
            // sets string for up to 40 characters only
            searchTerm = maxSearchLength(req.query.search, SEARCH_CHAR_LIMIT);
        }
    }

    
    let sqlReadySearchTerm = "%" + searchTerm + "%";
  
    // default query
    let baseSQL = setQuery("default");
    let defaultSQL = baseSQL;
    let queryArgs = [];

    // Query and Promise will change depending on type of search
    if (searchTerm && category) {
        baseSQL = setQuery("searchAndCategory");
        queryArgs = [sqlReadySearchTerm, category];
    } else if (searchTerm && !category) {
        baseSQL = setQuery("searchTermOnly");
        queryArgs = [sqlReadySearchTerm];
    } else if (!searchTerm && category) {
        baseSQL = setQuery("categoryOnly");
        queryArgs = [category];
    }

    baseSQL = insertSort(baseSQL, sort);
    db.execute(baseSQL, queryArgs)
        .then(([results, fields]) => {
            if (results && results.length == 0) {
                res.locals.found = false;
                return db.execute(insertSort(defaultSQL, sort), []);
            }
            else {
                res.locals.found = true;
                return db.execute(baseSQL, queryArgs)
            }
        })
        .then(([results, fields]) => {
            // Maintains search term entered
            res.locals.searchTerm = searchTerm;

            // Maintains selected option in dropdown menu
            if (category) {
                var categoryIndex = res.locals.categories.findIndex((element) => element.name === category);
                res.locals.categories[categoryIndex].selected = true;
                res.locals.category = category;
            }
            
            var sortMethodIndex = res.locals.sortMethods.findIndex(element => element.value === sort);
            res.locals.sortMethods[sortMethodIndex].selected = true;

            res.locals.searchResultsNumber = results.length;  
            res.locals.results = results;

            next();
        })
        .catch((err) => console.log(err));
}

module.exports = searchMiddleware;