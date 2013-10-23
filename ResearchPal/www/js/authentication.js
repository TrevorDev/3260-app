function validateUser(pinEntered){
	$.ajax({
		type: "POST",
		url: 'http://127.0.0.1/appAuth',
		crossDomain: true,
		dataType: 'json',
		data: {
			pin: pinEntered
		},
		success: function(data) {
			var jsonData = $.parseJSON(data);
			var valid = jsonData.valid;
			alert("yay" + valid);
	    	},
	    	error: onError
	 });
	return false;
}

function onError(jqXHR, textStatus, errorThrown) {
// or use alerts if you can't see your log
alert("status: " + textStatus);
alert("errorThrown: " + errorThrown);
// can't remember if this works:
alert(jqXHR.statusText);
}
