var mysql =  require('mysql');

var connMySQL = function(){
	    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'LogicaGamesTC'
    });

}
module.exports = function(){
    console.log('Connected!');
	return connMySQL;
}
