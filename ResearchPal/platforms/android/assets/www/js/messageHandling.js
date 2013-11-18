function loadMessages(){
  $.ajax({
    type: "GET",
    url: 'http://131.104.48.208/message',
    crossDomain: true,
    success: function(messages) {
      if ($.trim(messages) == 'failed'){
        alert('Error retrieving messages');
      } else {
        for (var i = 0; i < messages.length; i++){
          $('.messageWindow').append('<div class="message left"><div class="well bubble"><p><b>Researcher</b><br />' + 
              messages[i].type + '</p></div></div>');
        }
      }
    },
    error: onError
  });
}