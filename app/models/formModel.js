function Forms(connection){
	this._connetction = connection;
}

Forms.prototype.getLogin = function(login, connection, callback){
	connection.query('select * from usuario where (email = ?) and (senha = ?)', login, callback);
}

Forms.prototype.salvarCadastro = function(cadastro, connection, callback){
	connection.query('insert into usuario(nome, email, idade, senha) values (?, ?, ?, md5(?)) ', cadastro, callback);
}

Forms.prototype.resPass = function(connection,callback){
	connection.query('', callback);
}

Forms.prototype.home = function(connection,callback){
	connection.query('', callback);
}

Forms.prototype.salvarDados = function(dadosGame, connection, callback){
	connection.query('insert into niveis(n_passos , n_pontos , n_blocos, n_tentativas , id_nivel, resultadoDesempenho) values (?, ?, ?, ?, null, "") ', dadosGame, callback);
}

module.exports = function(){
	return Forms;
}