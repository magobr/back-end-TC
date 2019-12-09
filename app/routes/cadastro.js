module.exports = function(app) {
 
  app.get("/cadastro", function(req, res) {
    var connection = app.config.dbConnection();
    var formModel = new app.app.models.formModel();
    formModel.getProfessor(connection, function(erro, result){
      res.render("forms/cadastro/cadastro", {dados: result});
    })
  });

  app.post('/cadastro',function(req, res){
    var connection = app.config.dbConnection();
    var formModel = new app.app.models.formModel();
    formModel.getProfessor(connection, function(erro, result){
      res.render("forms/cadastro/cadastro", {dados: result});
    })
  });

  app.get("/cadastrado", function(req, res) {
    res.render("body/cadastrado/cadastrado");
  });

  app.post("/cadastrado", function(req, res) {


    var connection = app.config.dbConnection();
    var formModel = new app.app.models.formModel();

    var nome = req.body.nome;
    var email = req.body.email;
    var idade = req.body.idade;
    var professor = req.body.professor;
    var senha = req.body.senha;
    var cadastro = [nome, email, idade, professor, senha];

    
    if (
      nome == "" ||
      nome == undefined ||
      nome.length < 3 ||
      (email == "" || email == undefined || email.length < 3) ||
      (idade == "" || idade == undefined) ||
      (senha == "" || senha == undefined || senha.length < 3)
    ) {
      res.send("Error");
    } else {

      

      formModel.salvarCadastro(cadastro, connection, function(erro, result) {
        if (erro) {
          throw erro;
        }                  
        console.log(cadastro);
        res.redirect("/cadastrado");
      });
    }
    
  

    
  });
};
