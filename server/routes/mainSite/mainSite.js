var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var researchAuth = rek('researchAuth.js');
var formM = rek('formModel.js');
var userM = rek('userModel.js');
var groupM = rek('groupModel.js');
var messageM = rek('messageModel.js');

exports.showMainPage = function(req, res, next) {
    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showLogon = function(req, res, next) {
    view = 'logon';
    exports.render(req, res, next, 'researcherPortal/' + view);
};

exports.showMessage = function(req, res, next) {

    var researcherID = req.session.userID;

    if (req.params.participantID){
        var participantID = req.params.participantID;

        messageM.retrieveList(participantID, researcherID, function(success, messages){
            res.template = {};
            res.template.messages = messages;

            view = 'message';
            exports.render(req, res, next, 'researcherPortal/' + view);
        });
    }
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

exports.approveApp = function(req, res, next) {
    view = 'dashboard';
    if(researchAuth.auth(req)){
        userM.approveApplicant(req.params.id, function(applyData){
            res.template=new Object();
            res.template.applyData = applyData;
            exports.render(req, res, next, 'researcherPortal/' + view);
        });
    }else{
        res.redirect('/');
    }
};

exports.showApplicants = function(req, res, next) {
    view = 'applicants';
    if(researchAuth.auth(req)){
        userM.getApplicant(req.params.id, function(applyData){
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

exports.showGroupParticipant = function(req, res, next) {
    view = 'group';
    if(researchAuth.auth(req)){
        userM.getGroupParticipants(req.params.id, function(participants){
            res.template=new Object();
            res.template.participants = participants;
            res.template.username = req.session.username;
            groupM.getGroupName(req.params.id, function(group) {
                res.template.groupName = group[0].groupName;
                exports.render(req, res, next, 'researcherPortal/' + view);   
            });
        });
    }else{
        res.redirect('/');
    }
}

exports.showProjects = function(req, res, next) {
    view = 'projectLists';
    groupM.getProjectList( function(project){
        res.template=new Object();
        res.template.project = project;
        exports.render(req, res, next, 'researcherPortal/' + view);   
    });
}

exports.render = function(req, res, next, file) {
    fs.exists(process.cwd() + '/views/' + file + '.ejs', function(exists) {
        if (exists) {
            res.render(file, res.template);
        } else {
            next();
        }
    });
};

