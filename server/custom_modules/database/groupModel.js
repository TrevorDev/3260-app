/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: groupModel.js
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

/*NodeJS Module*/
var rek = require('rekuire');

/*Custom modules*/
var db = rek('database.js');


/*Gets a list of groups created by researcher*/
exports.getResearchersGroups= function(username,callback) {
	var conn = db.getConnection();
	conn.query(
          "SELECT *, count(TABLEB.userID) as numOfParticipants "+
          "from "+

          "(SELECT group.groupID, group.name, group.startDate, group.endDate "+
          "FROM pal.group, pal.researcher "+
          "WHERE pal.group.ownerID = researcher.userID "+
          "and researcher.username =  " + conn.escape(username) + " ) as TABLEA "+

          "left join "+

          "(SELECT participant.groupID as gID, participant.userID "+
          "FROM participant "+
          "where participant.active = 1) as TABLEB "+

          "on TABLEB.gID = TABLEA.groupID "+

          "group by TABLEA.groupID;", function(err, rows, fields) {
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