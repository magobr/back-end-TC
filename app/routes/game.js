const express = require('express')

module.exports = function(app){

    app.use('/game', express.static('game'))

    app.get('/game',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = new app.app.models.formModel;

    	formModel.game(connection, function(erro, result){
            res.render('game/maze', {noticia: result})
        });
    })
};