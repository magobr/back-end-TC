module.exports = function(app){
    app.post("/cadastroProf", function(req, res) {
        res.render("admin/cadastro/admin");
    });

    app.get('/admin',function(req, res){
        res.render('admin/login/admin');
    });

    app.post('/admin',function(req, res){
        res.render('admin/login/admin');
    });

    app.post('/cadastradoProfe', function(req, res){

        var nome = req.body.nome;
        var credencial = req.body.credencial;
        var email = req.body.email;
        var senha = req.body.senha;
        var cadastro = [nome, credencial, email, senha];

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;

        if(!nome == '' || !nome == undefined){
            formModel.salvarCadastroProfe(cadastro, connection, function(erro, result) {
                if (erro) {
                  throw erro;
                }                  
                console.log(cadastro);
                res.redirect("/admin");
            });
        } else{
            res.send("Error");
        }


    });

    app.post('/profe', function(req, res){
          
        var md5 = require("md5");

        var user = req.body.user;
        var senha = md5(req.body.senha);
        var login = [user, senha];

        console.log(login);

        var connection = app.config.dbConnection();             
        var formModel = new app.app.models.formModel;
        
      
        if (user && senha) {
            

            formModel.getLoginAdmin(login, connection, function(erro, result){
        
                if (erro) {
                    throw erro;
                } 

               
                    if (result.length > 0) {
                       
                        req.session.loggedin = true;
                        req.session.user = result[0].nome;
                        req.session.id_professor = result[0].id_professor;
                        res.redirect('/dash');
                        console.log('id: ',result[0].id_professor);

                    } else {
                        res.send('Incorrect Username and/or Password!');
                    }			
                    res.end();
            });
    
            

        } else {
            res.send('Please enter Username and Password!');
            res.end();
        }
        
    })



    app.get('/dash',function(req, res){
        var connection = app.config.dbConnection();       
        var formModel = new app.app.models.formModel;

        formModel.getPlayers(connection, function(erro, result){
            res.render('dash/players/dash', {dados: result});
        });
    });

    app.post('/getniveis' ,function(req, res){
       

        var connection = app.config.dbConnection();       
        var formModel = new app.app.models.formModel;

        var playerEmail = req.body.comboBox;

        console.log(playerEmail);

        formModel.getIdPlayers(playerEmail, connection, function(erro, result){
            
            var idUsuario = result[0].id_usuario;
            console.log(idUsuario);
            
            formModel.getDataPlayer(idUsuario, connection, function(erro, result){
                console.log('data', result);
                if (result == ''){
                    res.send('teste');
                }else{
                    res.render('dash/dataPlayers/dash', {dados: result});               
                }
                
            });

            
        });
    })


};