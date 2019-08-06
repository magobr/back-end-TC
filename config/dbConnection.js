var mysql =  require('mysql');

var connMySQL = function(){
		console.log('Conexção com o banco foi estabelecida')	
	    return mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'logicGamesTc'
    });
}


module.exports = function(){
	console.log('Autoload do banco carregado!')
	return connMySQL;
}
