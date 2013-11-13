var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var messageM = rek('messageModel.js');
var userM = rek('userModel.js');
var auth = rek('researchAuth.js');
var path = require('path');
var mediaPath = './public/';

exports.addRecording = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
    */
    var pin;
    var newPath = process.cwd() + "/uploads/" + req.files.file.name;
    var relativePath = "/uploads/" + req.files.file.name;
    console.log("PATH " + newPath);

    fs.rename(req.files.file.path, newPath, function(err){
        var msgFrom = req.session.userID;
        userM.getResearcher(msgFrom, function(success, row){
            var msgTo = "false";
            if (success){
                msgTo = row.researcherID;
                // TODO: take out <mediaPath> from stored path
                messageM.store(msgFrom, msgTo, relativePath, function(success){
                    if (success){
                        res.send('success');
                    }
                    res.send('failed');
                });
            } else {
                res.send('failed');
            }
        });
    });
}

exports.listMessages = function(req, res, next) {
    var researcherID = req.session.userID;

    if (req.params.participantID){
        var participantID = req.params.participantID;

        messageM.retrieveList(participantID, researcherID, function(success, messages){
            if (success){
                res.send(messages);
            }
            res.send('failed');
        });
    }

    /* res.send('Researcher ' + researcherID + '\nParticipant ' + participantID); */
}

exports.getRecording = function(req,res,next) {
    if (auth.auth(req)){
        console.log(req.params.fileName);
        var filePath = path.join(process.cwd(), '/uploads/', req.params.fileName);
        
        res.download(filePath);
    }
}
