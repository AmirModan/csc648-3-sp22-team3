/******************************************************************************
* 
* This module connects our database to the application. Allows 
* us to create queries for get and post requests
*
* Author(s):
*
******************************************************************************/

const mysql = require('mysql2');

/* Connecting Database; using promises for async code */ 
const db = mysql.createPool({
    host: 'production-db.c5zxj2uma5mb.us-east-1.rds.amazonaws.com',
    user: 'production',
    password: 'password',
    database: 'test_db'
});

module.exports = db.promise()