module.exports = function(){
	this.getLogin = function(connection, callback){
		connection.query('select * from usuario', callback);
	};

	this.cadastro = function(connection,callback){
		connection.query('', callback);
	}

	return this;
}