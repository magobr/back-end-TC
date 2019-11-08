module.exports = function(app){

    app.get('/login',function(req, res){
        res.render('forms/login/login');
    });

    app.post('/logado', function(req, res) {

        var md5 = require('md5');

        var email = req.body.email;
        var senha = md5(req.body.senha);
        var login = [email, senha];

        console.log(login);

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
        
      
        if (email && senha) {
            

            formModel.getLogin(login, connection, function(erro, result){
        
                if (erro) {
                    throw erro;
                } 

                formModel.getIdLogin(login, connection, function(erro, id_usuario){
                    if (result.length > 0) {
                        req.session.loggedin = true;
                        req.session.email = email;
                        res.redirect('/game');
                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }			
                    res.end();
                });
    
            });

        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
        
    })

};