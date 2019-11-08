module.exports = function(app){

    app.get('/alterarsenha',function(req, res){
        res.render('forms/resPass/resPass');
    });

    app.post('/senhaalterada' , function(req, res) {

        var md5 = require('md5');

        var dados = req.body;
        var email = req.body.email;
        var senha = md5(req.body.senha);

        var dados = [email, senha];
        
        var connection = app.config.dbConnection();
    	var formModel = new app.app.models.formModel;

    	formModel.resPass(dados, connection, function(erro, result){
            
            if (erro) {
                throw erro;
            }
    
            console.log(dados);
            res.redirect('/login');
        })

    })

};