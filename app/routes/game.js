module.exports = function(app){

    app.get('/game',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.game(connection, function(erro, result){
            res.render('forms/game/game', {noticia: result})
        });

    });

};