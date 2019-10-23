const express = require('express');
var bodyParser = require('body-parser');

module.exports = function(app){
   
    app.use(bodyParser.json())

    app.use('/game', express.static('game'))

    app.get('/game',function(req, res){
        res.render('game/maze')
    })

    app.post('/dados', function(req, res){
        
        var dadosGame = req.body;     
        
        res.send(dadosGame);
        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
    
        formModel.salvarDados(dadosGame, connection, function(erro, result) {
            if (erro) {
                throw erro;
            }
        });
        console.log(dadosGame);        
    });
};