var express = require('express');
var consign = require('consign');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.set('view engine', 'ejs');
app.set('views','./app/views');

app.use('/static/css', express.static('app/css'));
app.use('/static/js', express.static('app/js'));
app.use('/static/img', express.static('app/img'));
app.use('/static/home', express.static('public/css'));
app.use('/static/libs', express.static('public/libs'));

app.use(session({
	secret: 'secret',
	resave: false,
	saveUninitialized: true,
	cookie: {maxAge:60000 }
}));

app.use(bodyParser.urlencoded({
	extended:true
}));

consign()
	.include('app/routes')
	.then('config/dbConnection.js')
	.then('app/models')
	.into(app);


module.exports = app;