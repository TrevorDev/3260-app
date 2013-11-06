var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.store = function(msgFrom, msgTo, message, callback) {
  var dateTime = '2013-03-24 13:24:22';
  var conn = db.getConnection();
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",1,"+conn.escape(dateTime)+");", function(err, result) {
    if (err) throw err;
    conn.query("INSERT INTO recording (messageID, recording) VALUES ("+conn.escape(result.insertId)+","+conn.escape(message)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}