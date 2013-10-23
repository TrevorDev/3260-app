var mysql      = require('mysql');

var connection;
exports.connect = function() {
	connection = mysql.createConnection({
	  host     : '131.104.48.208',
	  user     : 'root',
	  password : 'pal',
	});
	connection.connect();
}

exports.disconnect = function() {
	connection.end();
}

exports.getConnection = function(){
	return connection;
}


exports.test= function() {
	connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
	  if (err) throw err;

	  console.log('The solution is: ', rows[0].solution);
	});
}



