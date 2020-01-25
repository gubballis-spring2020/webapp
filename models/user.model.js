const mysqlConnection = require("./config/connection");

// constructor
const User = function(user) {
    this.email_address = user.email_address;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.password = user.password;
  };