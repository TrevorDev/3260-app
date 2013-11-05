var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.store = function(userid, message, callback) {
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