module.exports = function(app) {
  app.get("/cadastrado", function(req, res) {
    res.render("body/cadastrado/cadastrado");
  });
};
