var mysql = require("mysql");

var connMySQL = function() {
  return mysql.createConnection({
    host: "35.226.93.2",
    user: "root",
    password: "root",
    database: "LogicaGamesTC"
  });
};
module.exports = function() {
  console.log("Connected!");
  return connMySQL;
};
