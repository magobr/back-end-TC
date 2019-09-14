module.exports = function(app){

    app.get('/cadastro',function(req, res){
        res.render('forms/cadastro/cadastro');
    });

    app.post('/cadastrado',function(req, res){
        var cadastro = req.body;
        var cadastro = [req.body.nome, req.body.email, req.body.idade, req.body.senha];

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
        
        formModel.salvarCadastro(cadastro, connection, function(erro, result){

            if(erro) {
                throw erro;
            }

            console.log(cadastro);
            res.redirect('/cadastrado');
        });
        
    });

};