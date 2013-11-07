var uploadLocation = '/uploads';

$(function(){
    getMessageList();
});

function getMessageList(){
    var participantID = 1; // TODO: get this from somewhere
    $.ajax({
    type: "GET",
    /*url: 'http://131.104.48.208/message/' + participantID,*/
    url: '/message/' + participantID,
    success: function(data) {
      if (data != 'failed'){
        for (var i = 0; i < data.length; i++){
          console.log('row ' + data[i].path);
          $('#autoMessageArea').append('<audio src="' + uploadLocation + data[i].path + '" controls="controls"></audio>');
        }
      } else {
        console.log("ERROR: " + data);
      }
    },
        error: onError
    });
    return false;
}

function onError(){
  console.log("ERROR");
}