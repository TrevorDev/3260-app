/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: database.js
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

var mysql      = require('mysql');

var connection;
exports.connect = function() {
	connection = mysql.createConnection({
	  host     : '131.104.48.208',
      server   : '131.104.48.208',
      user     : 'root',
      password : 'pal',
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



