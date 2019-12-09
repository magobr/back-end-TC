module.exports = function(app){
    
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

        formModel.getDataPlayer(connection, function(erro, result){
            res.render('dash/datPlayers/dash', {dados: result});
        });
    })

}