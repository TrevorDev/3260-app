var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

var formM = rek('formModel.js');

exports.getApplyForm = function(req, res, next) {
	formM.getGroupsApplyForm(1,function(form){
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
