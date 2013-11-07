var rek = require('rekuire');

var db = rek('database.js');


exports.getResearchersGroups= function(username,callback) {
	var conn = db.getConnection();
	conn.query('select name,startDate,endDate,count(participant.userID) as numOfParticipants from pal.group, participant,researcher where participant.active = 1 and researcher.userID = pal.group.ownerID and researcher.username = '+conn.escape(username)+' group by pal.group.groupID;', function(err, rows, fields) {
	  if (err) throw err;
	  callback(rows);
	});
}

exports.createGroup= function(name,keyword,start,end,userID,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO pal.group (name, keyword, startDate, endDate,ownerID) VALUES ("+conn.escape(name)+","+conn.escape(keyword)+","+conn.escape(start)+","+conn.escape(end)+","+conn.escape(userID)+");", function(err, result) {
	  if (err) throw err;
	  callback(true, result.insertId);
	});
}