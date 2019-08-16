var mysql =  require('mysql');

var connMySQL = function(){
	    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'logicGamesTc'
    });
    console.log('Conexção com o banco foi estabelecida');
}


module.exports = function(){
	console.log('Autoload do banco carregado!')
	return connMySQL;
}
