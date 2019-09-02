module.exports = function(app){

    app.get('/alterarsenha',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.resPass(connection, function(erro, result){
            res.render('forms/resPass/resPass', {noticia: result});
        });

    });

};