const mysql = require('mysql');
const dbConfig = require('./db.config');
const Sequelize = require('sequelize');

require('dotenv').config();

// var mysqlConnection = mysql.createConnection({

//     // host: process.env.DB_HOST,
//     // port: process.env.DB_PORT,
//     // user: process.env.DB_USER,
//     // password: process.env.DB_PASSWORD,
//     // database: process.env.DB_NAME,

//     host: dbConfig.HOST,
//     user: dbConfig.USER,
//     password: dbConfig.PASSWORD,
//     database: dbConfig.DB
    
// });

mysqlConnection =  new Sequelize(dbConfig.DATABASE , dbConfig.USER, dbConfig.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });

  mysqlConnection.authenticate()
                 .then(() => console.log('Connected'))
                 .catch(err => console.log(err))

module.exports = mysqlConnection;