var express = require('express');
var app = express();
var server = require('http').Server(app);
var favicon = require('serve-favicon');

app.set('port', (process.env.PORT || 3000));
app.use(favicon(__dirname + '/app/images/favicon.ico'));
app.use('/npm', express.static('node_modules'));
app.use(express.static('app'));

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/app/index.html');
});

server.listen(app.get('port'), function () {
  console.log('Node app is running on port ', app.get('port'));
});

