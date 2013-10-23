var mysql      = require('mysql');

var connection;
exports.connect = function() {
	connection = mysql.createConnection({
	  host     : '131.104.48.208',
	  user     : 'root',
	  password : 'pal',
	  database : 'pal',
	});
	connection.connect();
}

exports.disconnect = function() {
	connection.end();
}

exports.getConnection = function(){
	return connection;
}



