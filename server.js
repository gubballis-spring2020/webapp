
const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./config/connection");

// Routes for User
const userRouter = require("./routes/user");

// Routes for bills
const billRouter = require("./routes/bills");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);

app.use('/bill', billRouter);

// app.listen(3000);
app.listen(3000)

module.exports = app;