function validateUser(pinEntered){
	$.ajax({
		type: "POST",
		url: 'http://127.0.0.1/appAuth',
		crossDomain: true,
		data: {
			pin: pinEntered
		},
		success: function(data) {
			console.log("validating user.... returned " + data);
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

