const mysql = require('mysql');
const dbConfig = require('./db.config');

require('dotenv').config();

var mysqlConnection = mysql.createConnection({

    // host: process.env.DB_HOST,
    // port: process.env.DB_PORT,
    // user: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    // database: process.env.DB_NAME,

    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
    
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log("Connected");
    else
        console.log("Connection error");
});

module.exports = mysqlConnection;