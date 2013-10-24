function validateUser(pinEntered){
	$.ajax({
		type: "POST",
		url: 'http://131.104.48.208/appAuth',
		crossDomain: true,
		data: {
			pin: pinEntered
		},
		success: function(data) {
			alert("validating user.... returned " + data);
	  },
	    	error: onError
	 });
	return false;
}

function onError(jqXHR, textStatus, errorThrown) {
// or use alerts if you can't see your log
	alert("status: " + textStatus + "errorThrown: " + errorThrown + " " + jqXHR.statusText);
}

