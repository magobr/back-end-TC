var app = require('./config/server');

var ip = '127.0.0.1';
var port = 3000;

app.listen(port, ip, function (){
    console.log('Servidor OK! Endereço: http://'+ ip + ':' + port);
});