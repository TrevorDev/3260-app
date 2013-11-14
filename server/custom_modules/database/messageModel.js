var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.store = function(msgFrom, msgTo, path, callback) {
  var dateTime = new Date();
  var conn = db.getConnection();
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",1,"+conn.escape(dateTime.toString())+");", function(err, result) {
    if (err) throw err;
    conn.query("INSERT INTO recording (messageID, path) VALUES ("+conn.escape(result.insertId)+","+conn.escape(path)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}

exports.retrieveList = function(msgFrom, msgTo, callback){
  var conn = db.getConnection();
  conn.query("Select path, timeSent " +
              "from recording, message " +
              "where recording.messageID = message.messageID " +
                "and fromUserID=" + conn.escape(msgFrom) +
                " and toUserID=" + conn.escape(msgTo), function(err, rows, fields) {
    if (err) throw err;
    if(rows.length>0){
      callback(true,rows);
    }else{
      callback(false);
    }
  });
}