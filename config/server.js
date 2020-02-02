var express = require('express'),
    http    = require('http'),
    path    = require('path');
var app = express();
var bodyParser = require('body-parser');
var db = require('./db');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname + '/views'));
app.set('view engine' + 'ejs');
app.engine('html', require('ejs').renderFile);
db();

var server = app.listen(3000, ()=>{
    console.log("Express server start port 3000");
});

app.use(bodyParser.urlencoded({ extended:true })); // request 모든 요청이 bodyparser를 거치게 함
app.use(express.static(__dirname + '/views'));

server.on('connection', (con) => {
    let address = con.address();
    console.dir('접속주소  ::' +  address.address + ' : ' + address.port);
});

server.on('request', (req, res) => {
    console.log('클라이언트 요청!');
});

var viewrouter  = require('./router/view_router')(app);
var tecouter  = require('./router/event_router')(app, bodyParser);
