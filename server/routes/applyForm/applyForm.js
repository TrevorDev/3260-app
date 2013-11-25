/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: applyForm.js
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
var formM = rek('formModel.js');
var groupM = rek('groupModel.js');
var userM = rek('userModel.js');


/*Submit Researcher Registration*/
exports.addResearcher = function(req, res, next) {
    userM.checkUsername(req.body.username,function(exists){
        if (exists == false) {
            userM.createResearcher(req.body.fname,req.body.lname,req.body.email,req.body.username,req.body.password,function(success){
                
            });
        }
        res.send(exists);
    });
};


/*Returns Project Information*/
exports.getApplyForm = function(req, res, next) {
	var groupID=null;
	if(req.params.id){
		groupID=req.params.id;
	}

	formM.getGroupsApplyForm(groupID,function(form){
		res.send(form);
	});
};


/*Create Project Group*/
exports.createGroup = function(req, res, next) {
	groupM.createGroup(req.body.name,req.body.keyword,req.body.start,req.body.end,req.session.userID,function(success,groupID){
		formM.createForm(req.body.questions,groupID,function(success){
			res.send({"valid": success});
		});
	});
};


/*Store Applicant Information*/
exports.submitForm = function(req, res, next) {
	userM.createParticipant(req.body.fname,req.body.lname,req.body.email,req.body.groupID,function(userid){
		formM.submitApplication(req.body.fname,req.body.lname,req.body.answers,req.body.groupID,userid,function(){
			res.send({"valid": "yes"});
		});
	});
};

