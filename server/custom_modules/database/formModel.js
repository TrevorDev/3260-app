var rek = require('rekuire');

var db = rek('database.js');


exports.getGroupsApplyForm= function(groupID,callback) {
	if(groupID==null){
		return [];
	}
	var conn = db.getConnection();
	conn.query('SELECT * from applicationForm,pal.group where pal.group.groupID = applicationForm.groupID and pal.group.groupID = '+conn.escape(groupID), function(err, rows, fields) {
	  if (err) throw err;
	  for(var i =0;i<rows.length;i++){
	  	if(rows[i].extraQuestions){
	  		rows[i].extraQuestions=rows[i].extraQuestions.toString().replace(/\n/g, '<br />');
	  	}
	  }
	  callback(rows);
	});
}

exports.submitApplication= function(fname,lname,answers,groupid,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO submittedApplicationForm (groupID, answers, firstName, lastName) VALUES (1, 'woo whooo', 'trev','bar');", function(err, rows, fields) {
	  if (err) throw err;
	  callback();
	});
}

exports.createForm= function(questions, groupid,callback) {
	var conn = db.getConnection();
	conn.query("INSERT INTO applicationForm (extraQuestions, groupID) VALUES ("+conn.escape(questions)+","+conn.escape(groupid)+");", function(err, rows, fields) {
	  if (err) throw err;
	  callback();
	});
}