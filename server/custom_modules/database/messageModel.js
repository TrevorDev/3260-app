/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: messageModel.js
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

/*NodeJS Modules*/
var rek = require('rekuire');

/*Custom Modules*/
var db = rek('database.js');
var uuid = require('node-uuid');


/*Send Diary Entries*/
exports.store = function(msgFrom, msgTo, latitude, longitude, path, callback) {
  var dateTime = new Date();
  var conn = db.getConnection();
  
  /*Stores General Diary Information*/
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent, latitude, longitude) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",1,"+conn.escape(dateTime)+","+conn.escape(latitude)+ ","+conn.escape(longitude)+");", function(err, result) {
    if (err) throw err;
    
    /*Store Location of Diary File*/
    conn.query("INSERT INTO recording (messageID, path) VALUES ("+conn.escape(result.insertId)+","+conn.escape(path)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}


/*Store Messages*/
exports.storeText = function(msgFrom, msgTo, msg, callback) {
  var dateTime = new Date();
  var conn = db.getConnection();
  
  /*Save General Message Information*/
  conn.query("INSERT INTO message (fromUserID,toUserID, messageType, timeSent) VALUES ("+conn.escape(msgFrom)+","+conn.escape(msgTo)+",2,"+conn.escape(dateTime)+");", function(err, result) {
    if (err) throw err;
    
    /*Store Entire Message*/
    conn.query("INSERT INTO textMsg (messageID, msg) VALUES ("+conn.escape(result.insertId)+","+conn.escape(msg)+");", function(err, result) {
      if (err) throw err;
      callback(true);
    });
  });
}


/*Retrieve Messages and Diary Entries*/
exports.getConversation = function(msgFrom, msgTo, callback){
  var conn = db.getConnection();

  /*Get Messages and General of Diary Information*/
  /*conn.query(
    "Select path, timeSent, msg, messageType,fromUserID, latitude, longitude, messageRead, message.messageID"+
    " from recording, message, textMsg"+
    " where (recording.messageID = message.messageID or textMsg.messageID = message.messageID)"+
        " and ((fromUserID=" + conn.escape(msgFrom) + " and toUserID=" + conn.escape(msgTo) + ") or (fromUserID=" + conn.escape(msgTo) + " and toUserID=" + conn.escape(msgFrom) + "))"+
        " group by message.messageID"+
        " order by timeSent", function(err, rows, fields) {
*/
  conn.query(
    "Select * from (Select message.messageID, timeSent, msg, messageType, fromUserID, latitude, longitude, messageRead " +
    "from message left join textMsg on textMsg.messageID = message.messageID " +
    "where ((fromUserID=" + conn.escape(msgFrom) + " and toUserID=" + conn.escape(msgTo)+ ") or (toUserID="+conn.escape(msgFrom)+" and fromUserID="+conn.escape(msgTo)+"))) as TABLEA " +
    "left join " +
    "(Select * " +
    "     from recording) as TABLEB " +
    "on (TABLEA.messageID = TABLEB.messageID);",function(err, rows, fields) {
    
    if (err) throw err;
    if(rows.length>0){
      callback(true,rows);
    }else{
      callback(false);
    }
  });
}


/*Retrieve Diary Entries File*/
exports.retrieveList = function(msgFrom, msgTo, callback){
  var conn = db.getConnection();
  
  /*Get Location of Diary file from server*/
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


/*Get Number of Diary Entries*/
exports.NumReadEntries = function(username, callback){
    var conn = db.getConnection();
    
    /*Pull the total number of diary Entries that have been read and haven't*/
    conn.query(
        "SELECT group.groupID, group.name as groupName, " +
        "SUM(case when messageRead is not NULL " +
            "and message.messageType = 1 " +
            "and message.toUserID = researcher.userID " +
            "and message.fromUserID = participant.userID " +
            "and participant.groupID = group.groupID " +
            "and researcher.userID = group.ownerID " +
            "and researcher.username = "  + conn.escape(username) + " " +
            "and message.timeSent > 0 " +
            "then 1 else 0 end) as readMsg, " +
            
        "SUM(case when messageRead is NULL " +
            "and message.messageType = 1 " +
            "and message.toUserID = researcher.userID " +
            "and message.fromUserID = participant.userID " +
            "and participant.groupID = group.groupID " +
            "and researcher.userID = group.ownerID " +
            "and researcher.username = "  + conn.escape(username) + " " +
            "and message.timeSent > 0 " +
            "then 1 else 0 end) as unreadMsg " +
                
        "FROM pal.message, pal.researcher, pal.group, pal.participant " +
        "GROUP by group.groupID;", function(err, rows, fields) {
        if (err) throw err;
        callback(rows);
    });
}


/*Update status of Diary Entry being read*/
exports.updateMsgRead = function(msgID, callback){
    var conn = db.getConnection();
    
    /*Update database*/
    conn.query(
        "UPDATE pal.message " +
        "SET message.messageRead = 1 " +
        "WHERE message.messageID = "  + conn.escape(msgID) + ";", function(err, result) {
        if (err) throw err;
        callback(true);
    });
}