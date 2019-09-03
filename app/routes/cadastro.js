module.exports = function(app){

    app.get('/cadastro',function(req, res){
        res.render('forms/cadastro/cadastro');
    });

    app.post('/cadastrado',function(req, res){
        var cadastro = req.body;
        res.send(cadastro);

        var connection = app.config.dbConnection();
    	var formModel = app.app.models.formModel;

        formModel.salvarCadastro(cadastro, connection, function(erro, result){
            res.redirect('/login')
        });
    });

};