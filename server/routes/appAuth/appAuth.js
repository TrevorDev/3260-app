/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: appAuth.js
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

var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var userM = rek('userModel.js');

exports.validateUser = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view); */
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
	var pin;

    userM.authParticipant(req.body.pin,function(success, userID){
        if(success){
            req.session.auth=req.body.pin;
            req.session.userID = userID;
            res.send("success");
        }else{
            res.send("false");
        }
    });
}
exports.auth = function(req, res) {
    res.send({'userID': req.session.userID, 'pin': req.session.auth});
}

exports.logout = function(req, res, next) {
    req.session=null;
    res.send('success');
}
