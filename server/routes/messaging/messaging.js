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

exports.getRecording = function(req,res,next) {
    if (auth.auth(req)){
        var filePath = path.join(process.cwd(), '/uploads/', req.params.fileName);

        res.download(filePath);
    }
}
