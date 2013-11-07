var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var researchAuth = rek('researchAuth.js');
var formM = rek('formModel.js');
var userM = rek('userModel.js');
var groupM = rek('groupModel.js');

exports.showMainPage = function(req, res, next) {
    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showLogon = function(req, res, next) {
    view = 'logon';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showMessage = function(req, res, next) {
    view = 'message';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showApply = function(req, res, next) {
    view = 'apply';
    formM.getGroupsApplyForm(req.params.id,function(form){
        res.template={};
        if(form.length>0){
            res.template.form = form[0];
        }else{
            res.template.form = {};

        }
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

exports.showApplicants = function(req, res, next) {
    view = 'applicants';
    if(researchAuth.auth(req)){
        userM.getApplicant(req.session.userID, function(applyData){
            res.template=new Object();
            res.template.applyData = applyData;
            exports.render(req, res, next, 'researcherPortal/' + view);
        });
    }else{
        res.redirect('/');
    }
};

exports.showDashboard = function(req, res, next) {
    view = 'dashboard';
    if(researchAuth.auth(req)){
        groupM.getResearchersGroups(req.session.username, function(groups){
            res.template=new Object();
            res.template.groups = groups;
            res.template.username = req.session.username;
            userM.getResearchersApprovalQueue(req.session.userID, function(queue){
                res.template.queue = queue;
                exports.render(req, res, next, 'researcherPortal/' + view);
            });
        });
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