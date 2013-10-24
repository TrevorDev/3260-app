//NODE JS modules
var express = require('express');
var ejs = require('ejs');
var app = express();
//CUSTOM modules
var rek = require('rekuire');
var db = rek('database.js');
db.connect();

var mainSite = rek('mainSite.js');
var researchAuth = rek('researchAuth.js');
var appAuth = rek('appAuth.js');
var applyForm = rek('applyForm.js');

//setup ejs with views folder
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.use(express.cookieParser('secret111'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(app.router);

//static requests
app.get('/public/*', function(req, res, next){
    express.static(__dirname)(req, res, function(){next('route')});
});

app.get('/applyForm/:id', applyForm.getApplyForm);
app.get('/createForm', mainSite.showCreateForm);
app.get('/dashboard', mainSite.showDashboard);
app.get('/researchAuth/logout', researchAuth.logout);
app.get('/*', mainSite.showMainPage);

//posts requests
app.post('/appAuth', appAuth.validateUser);
app.post('/researchAuth', researchAuth.login);
app.listen(80);

console.log("Started----------------------");