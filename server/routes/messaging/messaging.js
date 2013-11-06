var fs = require('fs');
var ejs = require('ejs');
var rek = require('rekuire');
var messageM = rek('messageModel.js');
var userM = rek('userModel.js');

exports.addRecording = function(req, res, next) {

    /* view = 'home';
    exports.render(req, res, next, 'researcherPortal/' + view); */
    res.header('Access-Control-Allow-Origin', "*");     // TODO - Make this more secure!!
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST');
    res.header('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept');
    var pin;
    /* res.send(req.files); */

    fs.readFile(req.files.file.path, function (err, data) {
        var msgFrom = req.session.userID;

        userM.getResearcher(msgFrom, function(success, row){
            var msgTo = "false";
            if (success){
                msgTo = row.researcherID;
            }
            res.send("User id " + msgFrom + " Researcher ID " + msgTo + "\n DATA " + data);
        });
        /*var msgTo = userM.getResearcher();
        messageM.storeMessage(msgFrom, msgTo, data);
        */
    });
    /*messageM.store(req.body.pin,function(success){
        if(success){
            req.session.auth=req.body.pin;
            res.send("success");
        }else{
            res.send("false");
        }
    });*/
}
