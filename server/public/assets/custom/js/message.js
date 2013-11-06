$(function(){
    getMessageList();
});

function getMessageList(){
    var participantID = 1; // TODO: get this from somewhere
    $.ajax({
    type: "GET",
    url: 'http://131.104.48.208/message/' + participantID,
    success: function(data) {
      console.log("DATA " + data);
    },
        error: onError
    });
    return false;
}