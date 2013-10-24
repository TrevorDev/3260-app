var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var userM = rek('userModel.js');

exports.login = function(req, res, next) {	
    userM.authResearcher(req.body.username,req.body.password,function(success){
        if(success){
            req.session.username=req.body.username;
            res.send("success");
        }else{
            res.send("false");
        }
        
    });
}

exports.auth = function(req) {  
    return req.session.username;
}

exports.logout = function(req, res, next) { 
    req.session=null;
    res.redirect('/');
}
