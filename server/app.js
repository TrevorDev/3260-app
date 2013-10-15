//NODE JS modules
var express = require('express');
var ejs = require('ejs');
var app = express();
//CUSTOM modules
var rek = require('rekuire');
var mainSite = rek('mainSite.js');

//setup ejs with views folder
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.cookieParser('secret111'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(app.router);


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'q1q1q1',
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
  if (err) throw err;

  console.log('The solution is: ', rows[0].solution);
});

connection.end();


//posts requests
//app.post('/login', mainSite.default);

//static requests
app.get('/public/*', function(req, res, next){
    express.static(__dirname)(req, res, function(){next('route')});
});

app.get('/*', mainSite.showMainPage);
app.listen(80);
console.log("Started----------------------");
