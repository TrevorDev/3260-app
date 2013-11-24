/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: userModel.js
*
* AUTHOR: 
*   Heesung Ahn
*   Trevor Baron
*   Anuj Bhatia
*   Angela Pang
*   Dan Robinson 
*
* DATE CREATED: 01/10/2013
* DATE LAST MODIFIED: 25/11/2013
*
* DESCRIPTION:
*   Contains the functions that handles user information to and 
*   from the database on the server.
*********************************************************************/
/*NodeJS Modules*/
var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

/*Custom Modules*/
var researchAuth = rek('researchAuth.js');
var formM = rek('formModel.js');
var userM = rek('userModel.js');
var groupM = rek('groupModel.js');
var messageM = rek('messageModel.js');
var email = rek('email.js');


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

/*Get Researcher Registration Page*/
exports.showRegistration = function(req, res, next) {
    view = 'register';
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


/*Gets the user messages*/
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


/*Update Diary Status*/
exports.updateDiaryStatus = function(req, res, next) {
    /*Determines if the user is logged in*/
    if(researchAuth.auth(req)){
        /*Call controller to approve applicant*/
        messageM.updateMsgRead(req.params.msgID, function(applyData){         
            res.redirect('/dashboard');
        });
    }else{
        res.redirect('/');
    }
};


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
        res.template=new Object();
        res.template.username = req.session.username;
        
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
            userM.getParticipant(req.params.id, function(err, participant){
                email.sendEmail(participant.email,"Reasearch Pal Application","You have been approved on researchPal! Your pin is "+participant.pin);         
                res.redirect('/dashboard');
            });
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
            res.template.username = req.session.username;
            
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
            
            /*Call controller for list of appending applications*/
            userM.getResearchersApprovalQueue(req.session.userID, function(queue){
                res.template.queue = queue;
                
                /*Get total Read and Unread Entries */
                messageM.NumReadEntries(req.session.username, function(diary){
                    res.template.diary = diary;
                    
                    exports.render(req, res, next, 'researcherPortal/' + view);
                });
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

