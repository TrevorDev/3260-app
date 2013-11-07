var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.authResearcher= function(username, password, callback) {
	var conn = db.getConnection();
	conn.query('SELECT * from researcher where username = '+conn.escape(username)+' and password='+conn.escape(password), function(err, rows, fields) {
	  if (err) throw err;
	  if(rows.length>0){
	  	callback(true,rows[0].userID);
	  }else{
	  	callback(false);
	  }
	});
}

exports.authParticipant= function(pin, callback) {
  var conn = db.getConnection();
  conn.query('SELECT userID from participant where pin = '+conn.escape(pin), function(err, rows, fields) {
    if (err) throw err;
    if(rows.length>0){
      callback(true, rows[0].userID);
    }else{
      callback(false);
    }
  });
}

exports.createParticipant= function(name,lastName,email,groupID,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO user (name,lastName, email, type) VALUES ("+conn.escape(name)+","+conn.escape(lastName)+","+conn.escape(email)+",1);", function(err, result) {
	  if (err) throw err;
	  var userid = result.insertId;
	  conn.query("INSERT INTO participant (userID,pin, groupID, active) VALUES ("+conn.escape(userid)+","+conn.escape(exports.getNewPin())+","+conn.escape(groupID)+",0);", function(err, result) {
		  if (err) throw err;
		  callback(userid);
	  });
	});
}

exports.getResearchersApprovalQueue= function(userID,callback) {
	var conn = db.getConnection();
	conn.query('select user.userID,user.name,user.lastName,pal.group.name as gname from user,participant, pal.group where user.userID = participant.userID and participant.active = 0 and pal.group.groupID = participant.groupID and pal.group.ownerID = '+conn.escape(userID), function(err, rows, fields) {
	  if (err) throw err;
	  callback(rows);
	});
}

exports.getApplicant= function(userID,callback) {
	var conn = db.getConnection();
	conn.query('select submittedApplicationForm.firstName,submittedApplicationForm.lastName,submittedApplicationForm.answers,submittedApplicationForm.userID from submittedApplicationForm where submittedApplicationForm.userID = 3', function(err, rows, fields) {
     if (err) throw err;
	  callback(rows);
	});
}

exports.approveApplicant=function(userID, res, callback){
	var conn = db.getConnection();
	
	conn.query("update pal.participant set active=1 where userID = 3", function(err, result) {
	 if (err) throw err;
	   callback(true);
	});
	res.send("success");

}

exports.getNewPin=function(){
	return uuid.v4().split('-')[0];
}

exports.getResearcher= function(userID,callback) {
  var conn = db.getConnection();
  conn.query("Select researcher.userID as researcherID " +
                "from pal.group, participant, researcher " +
                "where participant.groupID = group.groupID " +
                  "and group.ownerID = researcher.userID " +
                  "and participant.userID = " + conn.escape(userID), function(err, rows, fields) {
    if (err) throw err;
    if(rows.length>0){
      callback(true,rows[0]);
    }else{
      callback(false);
    }
  });
}