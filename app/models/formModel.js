function Forms(connection){
	this._connetction = connection;
}

Forms.prototype.getLogin = function(login, connection, callback){
	connection.query('select * from usuario where (email = ?) and (senha = ?)', login, callback);
}

Forms.prototype.getLoginAdmin = function(loginAdmin, connection, callback){
	connection.query('select * from professor where (email = ?) and (senha = ?)', loginAdmin, callback);
}

Forms.prototype.getDataPlayer = function(idUsuario, connection, callback){
	connection.query('SELECT usuario.id_usuario, usuario.nome, usuario.professor, niveis.nivel, niveis.n_tentativas, niveis.resultadoDesempenho FROM usuario inner join niveis on usuario.id_usuario = niveis.id_usuario where (usuario.id_usuario = ?);', idUsuario, callback);
}

Forms.prototype.getPlayer = function(playerEmail, connection, callback){
	connection.query('select id_usuario from usuario where (email = ?);', playerEmail, callback);
}

Forms.prototype.getPlayers = function(connection, callback){
	connection.query('select * from usuario;', callback);
}
Forms.prototype.getProfessor = function(connection, callback){
	connection.query('select * from professor;', callback);
}

Forms.prototype.getIdPlayers = function(playerEmail, connection, callback){
	connection.query('select * from usuario where (email = ?);', playerEmail, callback);
}

Forms.prototype.salvarCadastro = function(cadastro, connection, callback){
	connection.query('insert into usuario(nome, email, idade, professor, senha) values (?, ?, ?, ?, md5(?))', cadastro, callback);
}

Forms.prototype.salvarCadastroProfe = function(cadastro, connection, callback){
	connection.query('insert into professor(nome, credencial, email, senha) values (?, ?, ?, md5(?));', cadastro, callback);
}

Forms.prototype.resPass = function(dados, connection,callback){
	connection.query('UPDATE usuario SET senha = ?  WHERE email = ? ' , dados, callback);
}

Forms.prototype.salvarDados = function(dadosGame, connection, callback){
	connection.query('insert into niveis(n_passos , n_pontos , n_blocos, n_tentativas , id_nivel, resultadoDesempenho) values (?, ?, ?, ?, null, "") ', dadosGame, callback);
}

module.exports = function(){
	return Forms;
}