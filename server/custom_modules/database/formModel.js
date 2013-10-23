var rek = require('rekuire');

var db = rek('database.js');


exports.getGroupsApplyForm= function(groupID,callback) {
	var conn = db.getConnection();
	conn.query('SELECT * from applyFormInstance where groupID = '+conn.escape(groupID), function(err, rows, fields) {
	  if (err) throw err;
	  callback(rows);
	});
}