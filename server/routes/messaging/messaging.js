var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var messageM = rek('messageModel.js');
var userM = rek('userModel.js');

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
                messageM.store(msgFrom, msgTo, data, function(success){
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
