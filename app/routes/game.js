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
    var spawn = require("child_process").spawn;
    var userId = req.session.userId;
    console.log("userId", userId);
    var process = spawn("python", [
      "./test.py",
      req.body.numberOfBlocks,
      req.body.numberOfSteps,
      req.body.numberOfTries,
      req.body.points,
      userId,
      req.body.level
    ]);

    process.stdout.on("data", function(data) {
      console.log(data.toString());
      res.send(data.toString());
    });
  }
};
