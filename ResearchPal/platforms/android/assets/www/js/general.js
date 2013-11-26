/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: general.js
*
* AUTHOR: 
*   Heesung Ahn
*   Trevor Baron
*   Anuj Bhatia
*   Angela Pang
*   Dan Robinson 
*
* DATE CREATED: 01/10/2013
*
* DESCRIPTION:
*   Contains general functions for Research Pal App.
*********************************************************************/

function chat(){
	window.location = "chat.html";
	/*$.ajax({
		type: "GET",
		url: 'http://131.104.48.208/appAuth/chat',
		crossDomain: true,
		success: function(data) {
			if ($.trim(data) == "success"){
					window.location = "chat.html";
			}
	  },
	    	error: onError
	 });*/
}