function loadMessages(){
  $('#messages').html('');
  $.ajax({
    type: "GET",
    url: 'http://131.104.48.208/message',
    crossDomain: true,
    success: function(messages) {
      if ($.trim(messages) == 'failed'){
        alert('Error retrieving messages');
      } else {
        for (var i = 0; i < messages.length; i++){
          var msgType = messages[i].messageType;
          if (msgType == '1'){
            // Don't display recordings on the phone at this point
          } else {
            var message = messages[i].msg;
            $('#messages').append('<div class="message left"><div class="well bubble"><p><b>Researcher</b><br />' + 
              message + '</p></div></div>');
          }
        }
      }
    },
    error: onError
  });
}

function sendMessage(msg){
  $.ajax({
    type: "POST",
    url: 'http://131.104.48.208/sendTextMessage',
    crossDomain: true,
    success: function(success) {
      if ($.trim(success) = "success"){
        updateStatus('Message sent successfully');
      } else {
        updateStatus('There was an error sending your message');
      }
    },
    error: onError
  });
}

function updateStatus(status){
  $('.statusLabel').html(status);
}