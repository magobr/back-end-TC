module.exports = function(app){

    app.get('/cadastro',function(req, res){
        res.render('forms/cadastro/cadastro');
    });

    app.post('/cadastrado',function(req, res){
        
        var cadastro = req.body;
        var nome = req.body.nome;
        var email = req.body.email;
        var idade = req.body.idade;
        var senha = req.body.senha;
        var cadastro = [nome, email, idade, senha];

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
        
        if ( (nome == '' || nome == undefined || nome.length < 3) || (email == '' || email == undefined || email.length < 3) || (idade == '' || idade == undefined) || (senha == '' || senha == undefined || senha.length < 3)) {
            res.send('Error');
        } else {

            formModel.salvarCadastro(cadastro, connection, function(erro, result) {
        
                if (erro) {
                    throw erro;
                }
        
                console.log(cadastro);
                res.redirect('/cadastrado');
            });
        }
        
    });

};