var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

exports.validateUser = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view); */
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
	var pin;

    if(!req.session.auth){
        req.session.auth='hit'; 
        pin = req.body.pin;

    }else{
	   req.session.auth='hit2';
       pin = req.body.pin + " authenticated already";
    }
    res.send(req.session.auth + "" + pin);
}
