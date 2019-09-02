module.exports = function(app){

    app.get('/login',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.getLogin(connection, function(erro, result){
            res.render('forms/login/login', {noticia: result});
        });

    });

};