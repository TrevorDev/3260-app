/*NodeJS Module*/
var rek = require('rekuire');

/*Custom modules*/
var db = rek('database.js');


/*Gets a list of groups created by researcher*/
exports.getResearchersGroups= function(username,callback) {
	var conn = db.getConnection();
	conn.query(
	        "SELECT group.groupID, group.name, group.startDate, group.endDate, count(participant.userID) as numOfParticipants " +
            "FROM pal.group, pal.participant, pal.researcher " +
            "WHERE participant.active = 1 " +
                "and participant.groupID = pal.group.groupID " +
                "and researcher.userID = pal.group.ownerID " + 
                "and researcher.username = " + conn.escape(username) + " group by pal.group.groupID;", function(err, rows, fields) {
	  if (err) throw err;
	  callback(rows);
	});
}


/*Creates a new research group*/
exports.createGroup= function(name,keyword,start,end,userID,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO pal.group (name, keyword, startDate, endDate,ownerID) VALUES ("+conn.escape(name)+","+conn.escape(keyword)+","+conn.escape(start)+","+conn.escape(end)+","+conn.escape(userID)+");", function(err, result) {
	  if (err) throw err;
	  callback(true, result.insertId);
	});
}


/*Gets the group name*/
exports.getGroupName = function(groupID,callback) {
    var conn = db.getConnection();
    conn.query("SELECT group.name FROM pal.group WHERE group.groupID = " +conn.escape(groupID)+";", function(err, result) {
      if (err) throw err;
      callback(result);
    });
}


/*Gets the list of research groups*/
exports.getProjectList = function(callback) {
    var conn = db.getConnection();
    conn.query(
            "SELECT groupID, group.name AS groupName, group.startDate, group.endDate, user.name, user.lastname " +
            "FROM pal.group, pal.researcher, pal.user " +
            "WHERE researcher.userID = user.userID;", function(err, row) {
      if (err) throw err;
      callback(row);
    });
}