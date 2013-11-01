var rek = require('rekuire');

var db = rek('database.js');


exports.getResearchersGroups= function(username) {
	var conn = db.getConnection();
	conn.query('SELECT * from group,researcher where ownerID = userID and username = '+conn.escape(username), function(err, rows, fields) {
	  if (err) throw err;
	  if(rows.length>0){
	  	callback(true);
	  }else{
	  	callback(false);
	  }
	});
}

exports.authResearcher= function(username, password, callback) {
	var conn = db.getConnection();
	conn.query('SELECT * from researcher where username = '+conn.escape(username)+' and password='+conn.escape(password), function(err, rows, fields) {
	  if (err) throw err;
	  if(rows.length>0){
	  	callback(true);
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