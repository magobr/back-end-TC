module.exports = function(app) {
  
  app.post('/',function(req, res){
    res.render('home/index');
  });

  app.get("/", function(req, res) {
    res.render("home/index");
  });
     
};