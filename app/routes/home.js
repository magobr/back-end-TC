module.exports = function(app) {
  
  app.post('/',function(req, res){
    res.render('home/index');
  });

  app.get("/", function(req, res) {
    
    var connection = app.config.dbConnection();
    var formModel = new app.app.models.formModel();

    formModel.home(connection, function(erro, result) {
      res.render("home/index");
    });
    
  });
     
};