var rek = require('rekuire');

var db = rek('database.js');
var uuid = require('node-uuid');

exports.store = function(userid, message, callback) {
  var conn = db.getConnection();
}