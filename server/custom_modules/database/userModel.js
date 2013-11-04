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
  conn.query('SELECT * from participant where pin = '+conn.escape(pin), function(err, rows, fields) {
    if (err) throw err;
    if(rows.length>0){
      callback(true);
    }else{
      callback(false);
    }
  });
}

exports.createParticipant= function(name,lastName,email,groupID,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO user (name,lastName, email, type) VALUES ("+conn.escape(name)+","+conn.escape(lastName)+","+conn.escape(email)+",1);", function(err, result) {
	  if (err) throw err;
	  conn.query("INSERT INTO participant (userID,pin, groupID, active) VALUES ("+conn.escape(result.insertId)+","+conn.escape(exports.getNewPin())+","+conn.escape(groupID)+",0);", function(err, result) {
		  if (err) throw err;
		  callback(true);
	  });
	});
}

exports.getResearchersApprovalQueue= function(userID,callback) {
	var conn = db.getConnection();
	conn.query('select user.name,user.lastName,pal.group.name as gname from user,participant, pal.group where user.userID = participant.userID and participant.active = 0 and pal.group.groupID = participant.groupID and pal.group.ownerID = '+conn.escape(userID), function(err, rows, fields) {
	  if (err) throw err;
	  callback(rows);
	});
}

exports.getNewPin=function(){
	return uuid.v4().split('-')[0];
}