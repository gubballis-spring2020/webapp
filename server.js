
const express = require("express");
const bodyParser = require("body-parser");
const mysqlConnection = require("./config/connection");
const userRouter = require("./routes/user");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/user', userRouter);

// app.listen(3000);
app.listen(3000)

module.exports = app;