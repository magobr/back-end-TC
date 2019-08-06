var express = require('express');
var consign = require('consign');

var app = express();
app.set('view engine', 'ejs');
app.set('views','./app/views');
app.use('/static', express.static('public'));



consign()
	.include('app/routes')
	.then('config/dbConnection.js')
	.then('app/models')
	.into(app);


module.exports = app;