var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var researchAuth = rek('researchAuth.js');
var formM = rek('formModel.js');

exports.showMainPage = function(req, res, next) {
    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showApply = function(req, res, next) {
    view = 'apply';
    formM.getGroupsApplyForm(req.params.id,function(form){
        res.template=new Object();
        res.template.form = form;
        exports.render(req, res, next, 'researcherPortal/' + view);
    });
};

exports.showCreateForm = function(req, res, next) {
    view = 'createForm';
    if(researchAuth.auth(req)){
        exports.render(req, res, next, 'researcherPortal/' + view);
    }else{
        res.redirect('/');
    }
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