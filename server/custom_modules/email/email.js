/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: email.js
*
* AUTHOR: 
*   Heesung Ahn
*   Trevor Baron
*   Anuj Bhatia
*   Angela Pang
*   Dan Robinson 
*
* DATE CREATED: 01/10/2013
*********************************************************************/

var nodemailer = require("nodemailer");
// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "researchPalHelper@gmail.com",
        pass: "1111qqqq1"
    }
});

exports.sendEmail = function(to,subject,text){
        var mailOptions = {
            from: "Research Pal <researchPalHelper@gmail.com>", // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
            text: text, // plaintext body
            html: "<b>"+text+"</b>" // html body
        }
        smtpTransport.sendMail(mailOptions, function(err, response){
                if(err){
        //console.log(err);
            }else{
                //console.log("Message sent: " + response.message);
            }
        });
}

exports.sendEmailAjax = function(req, res, next){
        exports.sendEmail(req.body.to, req.body.subject, req.body.text);
          res.json({ success: "true"});
        console.log("sent mail");
}
