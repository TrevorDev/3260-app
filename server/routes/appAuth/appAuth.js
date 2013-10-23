var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

exports.validateUser = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view); */
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
	
    if(!req.session.test){
	req.session.test='hit';
    }else{
	req.session.test='hit2';
    }
    res.send(req.session.test);
}
