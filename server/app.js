/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: app.js
*
* AUTHOR: 
*   Heesung Ahn
*   Trevor Baron
*   Anuj Bhatia
*   Angela Pang
*   Dan Robinson 
*
* DATE CREATED: 01/10/2013
*********************************************************************/

/*NODE JS modules*/
var express = require('express');
var ejs = require('ejs');
var app = express();

/*CUSTOM modules*/
var rek = require('rekuire');
var db = rek('database.js');
db.connect();

var mainSite = rek('mainSite.js');
var researchAuth = rek('researchAuth.js');
var appAuth = rek('appAuth.js');
var applyForm = rek('applyForm.js');
var messaging = rek('messaging.js');
var userModel = rek('userModel.js');

/*setup ejs with views folder*/
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(express.cookieParser('secret111'));
app.use(express.cookieSession());
app.use(express.bodyParser());
app.use(app.router);


/*static requests*/
app.get('/public/*', function(req, res, next){
    express.static(__dirname)(req, res, function(){next('route')});
});

//Logon Requests
app.get('/logon', mainSite.showLogon);
app.get('/user', researchAuth.logout);
app.get('/researchAuth/logout', researchAuth.logout);
app.get('/researchAuth/auth', researchAuth.auth);

//Project Handling Requests
app.get('/projects', mainSite.showProjects);
app.get('/applyForm/:id', applyForm.getApplyForm);
app.get('/apply/:id', mainSite.showApply);

//Registeration Requests
app.get('/register', mainSite.showRegistration);

//Project Creation Requests
app.get('/createForm', mainSite.showCreateForm);
app.get('/dashboard', mainSite.showDashboard);
app.get('/group/:id', mainSite.showGroupParticipant);

//Participant Requests
app.get('/message/:participantID', mainSite.showMessage);
app.get('/message', mainSite.getMessages);
app.get ('/updateMsg/:msgID', mainSite.updateDiaryStatus);

//Applicant Requests
app.get('/approveApp/:id', mainSite.approveApp);
app.get('/rejectApp/:id', mainSite.rejectApp);
app.get('/applicants/:id', mainSite.showApplicants);

//Session Handler Requests
app.get('/appAuth/check', appAuth.auth);
app.get('/appAuth/logout', appAuth.logout);
app.get('/uploads/:fileName', messaging.getRecording);
app.get('/*', mainSite.showMainPage);


/*posts requests*/
app.post('/appAuth/login', appAuth.validateUser);
app.post('/researchAuth', researchAuth.login);
app.post('/createGroup', applyForm.createGroup);
app.post('/submitApplication', applyForm.submitForm);
app.post('/createResearcherAcc', applyForm.addResearcher);
app.post('/newRecording', messaging.addRecording);
app.post('/sendTextMessage', messaging.sendTextMessage);
app.listen(80);

console.log("Started----------------------");
