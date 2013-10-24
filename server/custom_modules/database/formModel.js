var rek = require('rekuire');

var db = rek('database.js');


exports.getGroupsApplyForm= function(groupID,callback) {
	if(groupID==null){
		return [];
	}
	var conn = db.getConnection();
	conn.query('SELECT applyFormField.name,applyFormField.description,fieldType.name as type from applyFormInstance,fieldInApplyFormInstance,applyFormField,fieldType where groupID = '+conn.escape(groupID)+' and applyFormInstance.applyFormInstanceID = applyFormInstance.applyFormInstanceID and applyFormField.applyFormFieldsID = fieldInApplyFormInstance.applyFormFieldID and fieldType.fieldTypeID = applyFormField.type', function(err, rows, fields) {
	  if (err) throw err;
	  for(var i =0;i<rows.length;i++){
	  	if(rows[i].description){
	  		rows[i].description=rows[i].description.toString();
	  	}
	  }
	  callback(rows);
	});
}