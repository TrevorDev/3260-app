var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var messageM = rek('messageModel.js');
var userM = rek('userModel.js');
var auth = rek('researchAuth.js');
var path = require('path');
var mediaPath = './public/';

exports.addRecording = function(req, res, next) {
    var pin;
    var date = new Date();

    var msgFrom = req.session.userID;
    userM.getResearcher(msgFrom, function(success, row){
        var msgTo = "false";
        if (success){
            msgTo = row.researcherID;

            // Files will be stored with the path /uploads/<fromID>_<toID>_<date sent>_filename.mp3
            var fileName = msgFrom + "_" + msgTo + "_" + date.valueOf() + "_" + req.files.file.name;
            var newPath = process.cwd() + "/uploads/" + fileName;
            var relativePath = "/uploads/" + fileName;

            fs.rename(req.files.file.path, newPath, function(err){
                messageM.store(msgFrom, msgTo, relativePath, function(success){
                    if (success){
                        res.send('success');
                    }
                    res.send('failed');
                });
            });
        } else {
            res.send('failed');
        }
    });
}

exports.sendTextMessage = function(req, res, next) {
    var date = new Date();
    var msgFrom = req.session.userID;
    var msgTo = req.body.messageToID;
    var msg = req.body.message;
    if (!msgTo) {
        // App sending a request
        userM.getResearcher(msgFrom, function(success, row){
            if (success){
                msgTo = row.researcherID;
                store(res, msgFrom, msgTo, msg);
            } else {
                res.send('failed');
            }
        });
    } else {
        store(res, msgFrom, msgTo, msg);
    }
}
function store(res, msgFrom, msgTo, msg){
    messageM.storeText(msgFrom, msgTo, msg, function(success){
        if (success){
            res.send('success');
        }
        res.send('failed');
    });
}

exports.getRecording = function(req,res,next) {
    if (auth.auth(req)){
        var filePath = path.join(process.cwd(), '/uploads/', req.params.fileName);

        res.download(filePath);
    }
}
