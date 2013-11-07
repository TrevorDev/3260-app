var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var messageM = rek('messageModel.js');
var userM = rek('userModel.js');
var mediaPath = '/media/';

exports.addRecording = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view);
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
    */
    var pin;

    fs.readFile(req.files.file.path, function (err, data) {
        var msgFrom = req.session.userID;
        userM.getResearcher(msgFrom, function(success, row){
            var msgTo = "false";
            if (success){
                msgTo = row.researcherID;
                var path = mediaPath + msgFrom;
                // Store message in <mediaPath>/fromID/
                createFile(path, data, 'test' function(success, fullPath){
                    if (success){
                        // TODO: take out <mediaPath> from stored path
                        messageM.store(msgFrom, msgTo, fullPath, function(success){
                            if (success){
                                res.send('success');
                            }
                            res.send('failed');
                        });
                    } else {
                        res.send('failed');
                    }
                });
            } else {
                res.send('failed');
            }
        });
    });
}

function createFile(path, data, timestamp, callback){
    // TODO: Check if directory and file exist before writing.
    var fullPath = path + '/' + timestamp + '.wav';
    fs.writeFile(fullPath, function(error){
        if (error){
           callback(false);
        }
        callback(true,fullPath);
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
