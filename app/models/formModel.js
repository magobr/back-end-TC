function Forms(connection){
	this._connetction = connection;
}

Forms.prototype.getLogin = function(login, connection, callback){
	connection.query('select * from usuario where (email = ?) and (senha = ?)', login, callback);
}
// Criar uma tabela de Admins
Forms.prototype.getAdmin = function(loginAdmin, connection, callback){
	connection.query('select * from usuario where (email = ?) and (senha = ?)', loginAdmin, callback);
}

Forms.prototype.getDataPlayer = function(connection, callback){
	connection.query('select * from niveis where id_usuario = 2;', callback);
}
Forms.prototype.getPlayers = function(connection, callback){
	connection.query('select nome, nivelAtual, classificacao from usuario;', callback);
}

Forms.prototype.salvarCadastro = function(cadastro, connection, callback){
	connection.query('insert into usuario(nome, email, idade, senha) values (?, ?, ?, md5(?)) ', cadastro, callback);
}

Forms.prototype.resPass = function(dados, connection,callback){
	connection.query('UPDATE usuario SET senha = ?  WHERE email = ? ' , dados, callback);
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