var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.store = function(msgFrom, msgTo, latitude, longitude, path, callback) {
  var dateTime = new Date();
  var conn = db.getConnection();
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent, latitude, longitude) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",1,"+conn.escape(dateTime)+","+conn.escape(latitude)+ ","+conn.escape(longitude)+");", function(err, result) {
    if (err) throw err;
    conn.query("INSERT INTO recording (messageID, path) VALUES ("+conn.escape(result.insertId)+","+conn.escape(path)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}

exports.storeText = function(msgFrom, msgTo, msg, callback) {
  var dateTime = new Date();
  var conn = db.getConnection();
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",2,"+conn.escape(dateTime)+");", function(err, result) {
    if (err) throw err;
    conn.query("INSERT INTO textMsg (messageID, msg) VALUES ("+conn.escape(result.insertId)+","+conn.escape(msg)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}

exports.getConversation = function(msgFrom, msgTo, callback){
  var conn = db.getConnection();

  conn.query(
    "Select path, timeSent, msg, messageType,fromUserID, latitude, longitude"+
" from recording, message, textMsg"+
" where (recording.messageID = message.messageID or textMsg.messageID = message.messageID)"+
" and ((fromUserID=" + conn.escape(msgFrom) + " and toUserID=" + conn.escape(msgTo) + ") or (fromUserID=" + conn.escape(msgTo) + " and toUserID=" + conn.escape(msgFrom) + "))"+
" group by message.messageID"+
" order by timeSent", function(err, rows, fields) {
    if (err) throw err;
    if(rows.length>0){
      callback(true,rows);
    }else{
      callback(false);
    }
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