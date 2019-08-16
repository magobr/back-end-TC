module.exports = function(app){

    app.get('/alterarsenha',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.ResPass(connection, function(erro, result){
            res.render('forms/resPass/resPass');
        });

    });

};