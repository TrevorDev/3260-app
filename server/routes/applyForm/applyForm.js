var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');

exports.getApplyForm = function(req, res, next) {
    res.send({"valid": "test"});
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
