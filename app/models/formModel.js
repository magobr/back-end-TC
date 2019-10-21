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

Forms.prototype.game = function(connection,callback){
	connection.query('', callback);
}

module.exports = function(){
	return Forms;
}