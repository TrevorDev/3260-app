var mysql      = require('mysql');

var connection;
exports.connect = function() {
	connection = mysql.createConnection({
	  host     : '131.104.48.208',
      server   : '131.104.48.208',
      user     : 'root',
      password : '',
      database : 'pal',
      port:'3306',
	});
	connection.connect();
}

exports.disconnect = function() {
	connection.end();
}

exports.getConnection = function(){
	return connection;
}



