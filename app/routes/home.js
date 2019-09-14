module.exports = function(app){

    app.get('/',function(req, res){
    	var connection = app.config.dbConnection();
    	var formModel = new app.app.models.formModel;

    	formModel.home(connection, function(erro, result){
            res.render('home/index')
        });

    });
};