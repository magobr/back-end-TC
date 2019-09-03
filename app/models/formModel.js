module.exports = function(){
	this.getLogin = function(connection, callback){
		connection.query('select * from usuario', callback);
	};

	this.salvarCadastro = function(cadastro, connection, callback){
		connection.query('insert into usuario set id_jogador = auto, ?', cadastro, callback);
	}
	
	this.resPass = function(connection,callback){
		connection.query('', callback);
	}

	this.home = function(connection,callback){
		connection.query('', callback);
	}

	this.game = function(connection,callback){
		connection.query('', callback);
	}


	return this;
}