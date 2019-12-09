var app = require('./config/server');


var ip = 'localhost';
var port = '3001';

app.listen(port, ip, function (){
    console.log('Servidor OK! Endereço: http://'+ ip + ':' + port);
});
