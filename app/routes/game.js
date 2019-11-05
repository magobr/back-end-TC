const express = require("express");
var bodyParser = require("body-parser");

module.exports = function(app) {
  app.use(bodyParser.json());

  app.use("/game", express.static("game"));

  app.get("/game", function(req, res) {
    res.render("game/maze");
  });

  app.post("/dados", function(req, res) {
    var dadosGame = req.body;
    console.log(req.body);
    res.send(dadosGame);
    var connection = app.config.dbConnection();
    var formModel = new app.app.models.formModel();

    formModel.salvarDados(dadosGame, connection, function(erro, result) {
      if (erro) {
        // throw erro;
      }
    });
    console.log(dadosGame);
  });

  app.post("/py", callName);

  function callName(req, res) {
    // Use child_process.spawn method from
    // child_process module and assign it
    // to variable spawn
    var spawn = require("child_process").spawn;
    console.log(req.body);
    // Parameters passed in spawn -
    // 1. type_of_script
    // 2. list containing Path of the script
    //    and arguments for the script

    // E.g : http://localhost:3000/name?firstname=Mike&lastname=Will
    // so, first name = Mike and last name = Will
    var process = spawn("python", [
      "./hello.py",
      req.body.numberOfBlocks,
      req.body.numberOfSteps,
      req.body.numberOfTries,
      req.body.points
    ]);

    // Takes stdout data from script which executed
    // with arguments and send this data to res object
    process.stdout.on("data", function(data) {
      console.log(data.toString());
      res.send(data.toString());
    });
  }
};
