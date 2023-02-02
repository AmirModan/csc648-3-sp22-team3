/******************************************************************************
*
* Here is where our application is ran. Dependencies are imported here.
* Middleware functions are used before using routers
*   
* Author(s):
*
******************************************************************************/
const https = require('https')
const http = require('http')
const fs = require('fs');
const express = require('express');
const { dirname } = require('path/posix');
const app = express();
const path = require('path');
const port = process.env.PORT || 8080;
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
var sessions = require('express-session');
var mysqlSession = require('express-mysql-session')(sessions);
var flash = require('express-flash');

/* Importing routers */
const indexRouter = require('./server/routes/index');
const productsRouter = require('./server/routes/products');
const usersRouter = require('./server/routes/users')
const messagesRouter = require('./server/routes/messages')
const { requestPrint, errorPrint, successPrint } = require('./server/helpers/debug/debugprinters');

/* Needed for req.body in form or it will be undefined */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static('./'))
app.use("/css", express.static(__dirname + '/public/css'))
app.use("/js", express.static(__dirname + '/public/js'))
app.use("/assets", express.static(__dirname + '/public/assets'))
//app.use("/public", express.static(__dirname + '/public'));

/* Setting up view engine */
app.engine(
  "hbs",
  handlebars.engine({
      layoutsDir: path.join(__dirname, "/public/views/layouts"),
      partialsDir: path.join(__dirname, "/public/views/partials"),
      extname: ".hbs",
      defaultLayout: "home"
  })
);

let mysqlSessionStore = new mysqlSession(
  {
    /*using default options*/
  },
  require('./server/config/database')
);


app.set('views', './public/views')
app.set('view engine', 'hbs')

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(sessions({
  key: "csid",
  cookie: { maxAge: 1000 * 60 * 60 * 24},
  secret: "this is a secret from csc648",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());



// middleware function to manage categories
const productsMiddleware = require('./server/middleware/productsmiddleware');
app.use(productsMiddleware.manageCategories);
app.use(productsMiddleware.manageSortMethods);

// middleware function to set search length
const searchMiddleware = require('./server/middleware/searchMiddleware');
app.use(searchMiddleware.setSearchLimit);

//We consistently check if there is a user logged in
app.use((req, res, next) => {

  if(req.session.username){
    res.locals.logged = true;
  }
  next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter)
app.use('/products', productsRouter);
app.use('/messages', messagesRouter)

/**
 * Catch all route, if we get to here then the 
 * resource requested could not be found.
 */
 app.use((req, res, next) => {
  next(createError(404, `The route ${req.method} : ${req.url} does not exist.`));
})

/**
 * Error Handler, used to render the error html file
 * with relevant error information.
 */
 app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = err;
  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// This is for our remote server
app.listen(80,'172.31.31.81')

// This is for development
// app.listen(80,'localhost')

