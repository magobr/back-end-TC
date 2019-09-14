module.exports = function(app){

    app.get('/login',function(req, res){
        res.render('forms/login/login');
    });

    app.post('/logado', function(req, res) {

        var login = req.body;
        var email = req.body.email;
        var senha = req.body.senha;
        var login = [email, senha];

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;

        if ( (email == '' || email == undefined || email.length < 3) || (senha == '' || senha == undefined || senha.length < 3) ) {
            
            res.send('Error');

        } else {

            formModel.getLogin(login, connection, function(erro, result){
            
                if (erro) {
                    throw erro;
                } else {
                    console.log(login);
                    res.render('user/user', {login: result});
                }
    
            });

        }
        
    })

};