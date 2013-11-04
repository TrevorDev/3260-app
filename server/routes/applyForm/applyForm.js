var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

var formM = rek('formModel.js');
var groupM = rek('groupModel.js');
var userM = rek('userModel.js');

exports.getApplyForm = function(req, res, next) {
	var groupID=null;
	if(req.params.id){
		groupID=req.params.id;
	}

	formM.getGroupsApplyForm(groupID,function(form){
		res.send(form);
	});
};

exports.createGroup = function(req, res, next) {
	groupM.createGroup(req.body.name,req.body.keyword,req.body.start,req.body.end,req.session.userID,function(success,groupID){
		formM.createForm(req.body.questions,groupID,function(success){
			res.send({"valid": success});
		});
	});
};

exports.submitForm = function(req, res, next) {
	userM.createParticipant(req.body.fname,req.body.lname,req.body.email,req.body.groupID,function(){
		res.send({"valid": "yes"});
	});    
};
