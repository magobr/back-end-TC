const express = require('express')

module.exports = function(app){
    app.use('/game', express.static('game'))

    app.get('/game',function(req, res){
        res.render('game/maze')
    })

    app.get('/game?level=2',function(req, res){
        
        var dadosGame = req.body;

        var n_passos = req.body.numberOfSteps
        var n_pontos = req.body.points
        var n_tentativas = req.body.lbl_numberOfTries
        var id_nivel = 1; // utilizar sessão
        var resultadoDesempenho = '';

        var dadosGame = [n_passos, n_pontos, n_tentativas, id_nivel, resultadoDesempenho];
        

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
            
        res.send('Error');
    
        formModel.salvarCadastro(dadosGame, connection, function(erro, result) {
    
            if (erro) {
                throw erro;
            }
    
            console.log(dadosGame);
        });
        
    });

};