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

    userM.authParticipant(req.body.pin,function(success){
        if(success){
            req.session.auth=req.body.pin;
            res.send("success");
        }else{
            res.send("false");
        }
    });
}
exports.auth = function(req) {
    return "HELLO";
    /* req.session.auth; */
}

exports.logout = function(req, res, next) {
    req.session=null;
    res.redirect('/');
}
