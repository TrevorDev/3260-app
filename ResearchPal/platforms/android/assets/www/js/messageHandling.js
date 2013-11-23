function loadMessages(){
  $('#messages').html('');
  getUserID(function(userID){
    if (userID){
      $.ajax({
        type: "GET",
        url: 'http://131.104.48.208/message',
        crossDomain: true,
        success: function(messages) {
          if ($.trim(messages) == 'failed'){
            alert('Error retrieving messages');
          } else {
            //updateStatus(messages.length + " Messages ");
            for (var i = 0; i < messages.length; i++){
              var msgType = messages[i].messageType;
              if (msgType == '1'){
                // Don't display recordings on the phone at this point
              } else {
                var message = messages[i].msg;
                var template = '<div class="message ';
                var user;
                if (messages[i].fromUserID == userID){
                  template += 'right';
                  user = "You";
                } else {
                  template += 'left';
                  user = "Researcher";
                }
                template += '"><div class="well bubble"><h3>' + user + '</h3><p>' + message + '</p></div></div>';
                $('#messages').append(template);
              }
            }
            $("#msgWindow").scrollTop($("#msgWindow")[0].scrollHeight);
          }
        },
        error: onError
      });
    }
  });
}

function getUserID(callback){
  checkIfAuthenticated(function(data){
    var userId = data.userID;
    callback(userId);
  });
}

function sendMessage(msg){
  $.ajax({
    type: "POST",
    url: 'http://131.104.48.208/sendTextMessage',
    crossDomain: true,
    data: {'message': msg },
    success: function(success) {
      if ($.trim(success) == "success"){
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