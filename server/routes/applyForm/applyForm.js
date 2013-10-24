var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

var formM = rek('formModel.js');

exports.getApplyForm = function(req, res, next) {
	var groupID=null;
	if(req.params.id){
		groupID=req.params.id;
	}

	formM.getGroupsApplyForm(groupID,function(form){
		res.send(form);
	});
};

exports.createForm = function(req, res, next) {
    res.send({"valid": "yes"});
};

exports.editForm = function(req, res, next) {
    res.send({"valid": "yes"});
};

exports.submitForm = function(req, res, next) {
    res.send({"valid": "yes"});
};
