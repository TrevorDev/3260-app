function checkIfAuthenticated(callback){
		$.ajax({
		type: "GET",
		url: 'http://131.104.48.208/appAuth/check',
		crossDomain: true,
		success: function(data) {
			callback(data);
	  },
	    	error: onError
	  });
		return false;
}

function validateUser(pinEntered){
	/* Add this eventually to check session.
	checkIfAuthenticated(); */
	if (navigator.connection.type == Connection.NONE) {
        $('#error').text('No network connection');
        $('#error').show();   
    }
    else {
		$('#error').hide();        
    }
	if (pinEntered.length > 0)
	{
		$.ajax({
			type: "POST",
			url: 'http://131.104.48.208/appAuth/login',
			crossDomain: true,
			data: {
				pin: pinEntered
			},
			success: function(data) {
				if ($.trim(data) == "success"){
					//check user if it
						window.location = "dashboard.html";
				} else {
						$('#error').text('PIN is invalid or expired.');
						$('#error').show();
				}
		  },
		    	error: onError
		 });
	}
	else
	{
		$('#error').text('Please enter PIN.');
	}
	return false;
}

function validateProjectDate(){
	var today = new Date();
	var projectEndDate = new Date(); // need to replace with actual project date

	if (today > projectEndDate)
	{
		// then we redirect
	}
	else
	{
		// redirect to project over page
	}
}

function logout(){
	$.ajax({
		type: "GET",
		url: 'http://131.104.48.208/appAuth/logout',
		crossDomain: true,
		success: function(data) {
			if ($.trim(data) == "success"){
					window.location = "index.html";
			}
	  },
	    	error: onError
	 });
}

function onError(jqXHR, textStatus, errorThrown) {
// or use alerts if you can't see your log
	//alert("status: " + textStatus + "errorThrown: " + errorThrown + " " + jqXHR.statusText);
}

