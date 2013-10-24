var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var researchAuth = rek('researchAuth.js');

exports.showMainPage = function(req, res, next) {
    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showCreateForm = function(req, res, next) {
    view = 'createForm';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showDashboard = function(req, res, next) {
    view = 'dashboard';
    if(researchAuth.auth(req)){
    	exports.render(req, res, next, 'researcherPortal/' + view);
	}else{
		res.redirect('/');
	}
};

exports.render = function(req, res, next, file) {
    fs.exists(process.cwd() + '/views/' + file + '.ejs', function(exists) {
        if (exists) {
            res.render(file, res.template);
        } else {
            next();
        }
    });
};