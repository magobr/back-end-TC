module.exports = function(app){

    app.get('/AlterarSenha',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.ResPass(connection, function(erro, result){
            res.render('forms/ResPass/ResPass');
        });

    });

};