module.exports = function(app){

    app.get('/cadastro',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

    	formModel.cadastro(connection, function(erro, result){
            res.render('form/cadastro', {noticia: result});
        });

    });

};