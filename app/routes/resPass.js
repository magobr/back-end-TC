module.exports = function(app){

    app.get('/alterarsenha',function(req, res){
    	
        res.render('forms/resPass/resPass');
        
    });

    app.post('/senhaalterada' , function(req, res) {

        var reSenha = req.body;
        var email = req.body.email;
        var senha = req.body.senha;

        var reSenha = [email, senha];
        
        var connection = app.config.dbConnection();
    	var formModel = new app.app.models.formModel;

    	formModel.resPass(connection, function(erro, result){
            console.log(reSenha);
            res.send('senha alterada: ' + senha);
        })

    })

};