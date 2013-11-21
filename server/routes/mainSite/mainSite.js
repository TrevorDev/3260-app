/*nodeJS Function Variable Declaration*/
var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

/*Variable Referencing to additional files*/
var researchAuth = rek('researchAuth.js');
var formM = rek('formModel.js');
var userM = rek('userModel.js');
var groupM = rek('groupModel.js');
var messageM = rek('messageModel.js');


/*Redirects to home page*/
exports.showMainPage = function(req, res, next) {
    view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
};


/*Redirects to display page*/
exports.showLogon = function(req, res, next) {
    view = 'logon';
    exports.render(req, res, next, 'researcherPortal/' + view);
};


/*Get the information for message page*/
exports.showMessage = function(req, res, next) {
    var researcherID = req.session.userID;

    /*Determine if userID has been passed over*/
    if (req.params.participantID){
        var participantID = req.params.participantID;

        /*Call controller to get the messages*/
        messageM.getConversation(participantID, researcherID, function(success, messages){
            res.template = {};
            res.template.messages = messages;
            res.template.participantID=participantID;
            res.template.username = req.session.username;
            
            /*Redirects to message page*/
            view = 'message';
            exports.render(req, res, next, 'researcherPortal/' + view);
        });
    }
};


/*Gets the messages user messages*/
exports.getMessages = function(req, res, next) {
    var msgFrom = req.session.userID;
    
    /*Call controller to get the messages for a particular user*/
    userM.getResearcher(msgFrom, function(success, row){
        var msgTo = "false";
        if (success){
            msgTo = row.researcherID;
            messageM.getConversation(msgFrom, msgTo, function(success, messages){
                if (success){
                    res.send(messages);
                } else {
                    res.send('failed');
                }
            });
        } else {
            res.send('failed');
        }
    });
}

/*Gets the application*/
exports.showApply = function(req, res, next) {
    view = 'apply';
    
    /*Call control to get application form information*/
    formM.getGroupsApplyForm(req.params.id,function(form){
        res.template={};
        if(form.length>0){
            res.template.form = form[0];
        }else{
            res.template.form = {};
        }
        
        /*Directs user to the application page*/
        exports.render(req, res, next, 'researcherPortal/' + view);
    });
};


/*Direct researcher to Create Form*/
exports.showCreateForm = function(req, res, next) {
    view = 'createForm';
    
    /*Determine if the user is logged in*/
    if(researchAuth.auth(req)){
        exports.render(req, res, next, 'researcherPortal/' + view);
    }else{
        res.redirect('/');
    }
};


/*Approve applicants*/
exports.approveApp = function(req, res, next) {
    /*Determines if the user is logged in*/
    if(researchAuth.auth(req)){
        /*Call controller to approve applicant*/
        userM.approveApplicant(req.params.id, function(applyData){         
            res.redirect('/dashboard');
        });
    }else{
        res.redirect('/');
    }
};


/*Reject applicants*/
exports.rejectApp = function(req, res, next) {
    /*Determines if the user is logged in*/
    if(researchAuth.auth(req)){
        /*Call controller to approve applicant*/
        userM.rejectApplicant(req.params.id, function(applyData){         
            res.redirect('/dashboard');
        });
    }else{
        res.redirect('/');
    }
};


/*Get applicant's information for the applicant's page*/
exports.showApplicants = function(req, res, next) {
    view = 'applicants';
    
    /*Determine if user is logged in*/
    if(researchAuth.auth(req)){
        /*Call controller to get the applicant's information*/
        userM.getApplicant(req.params.id, function(applyData){
            res.template=new Object();
            res.template.applyData = applyData;
            
            /*Direct user to the applicant's application page*/
            exports.render(req, res, next, 'researcherPortal/' + view);
        });
    }else{
        res.redirect('/');
    }
};


/*Redirects to the dashboard page*/
exports.showDashboard = function(req, res, next) {
    view = 'dashboard';
    
    /*Determine if user is logged in*/
    if(researchAuth.auth(req)){
        /*Call controller to get the group*/
        groupM.getResearchersGroups(req.session.username, function(groups){
            res.template=new Object();
            res.template.groups = groups;
            res.template.username = req.session.username;
            
            /*Call controller go the user logged in as*/
            userM.getResearchersApprovalQueue(req.session.userID, function(queue){
                res.template.queue = queue;
                exports.render(req, res, next, 'researcherPortal/' + view);
            });
        });
	}else{
		res.redirect('/');
	}
};


/*Gets the list of participants for the group*/
exports.showGroupParticipant = function(req, res, next) {
    view = 'group';
    
    /*Determine if the user is logged in*/
    if(researchAuth.auth(req)){
        userM.getGroupParticipants(req.params.id, function(participants){
            res.template=new Object();
            res.template.participants = participants;
            res.template.username = req.session.username;
            
            /*Get the group name*/
            groupM.getGroupName(req.params.id, function(group) {
                res.template.groupName = group[0].name;
                
                /*Directs user to research group page*/
                exports.render(req, res, next, 'researcherPortal/' + view);   
            });
        });
    }else{
        res.redirect('/');
    }
}


/*Gets a list of all active projects*/
exports.showProjects = function(req, res, next) {
    view = 'projectLists';
    
    /*Gets project information*/
    groupM.getProjectList( function(project){
        res.template=new Object();
        res.template.project = project;
        
        /*Directs user to project list page*/
        exports.render(req, res, next, 'researcherPortal/' + view);   
    });
}


/*Gets the page requested*/
exports.render = function(req, res, next, file) {
    /*Determine if page exists on system*/
    fs.exists(process.cwd() + '/views/' + file + '.ejs', function(exists) {
        if (exists) {
            res.render(file, res.template);
        } else {
            next();
        }
    });
};

