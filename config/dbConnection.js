var mysql = require("mysql");

var connMySQL = function() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "LogicGamesTC2"
  });
};
module.exports = function() {
  console.log("Connected!");
  return connMySQL;
};
