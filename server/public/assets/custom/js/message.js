var context;

$(function(){
  try {
    // Fix up for prefixing
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new webkitAudioContext();
  }
  catch(e) {
    alert('Web Audio API is not supported in this browser');
  }
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
        }
      } else {
        console.log("ERROR: " + data);
      }
    },
        error: onError
    });
    return false;
}

function loadSound(sound, callback){
  var soundBuffer;
  context.decodeAudioData(sound, function(buffer) {
      soundBuffer = buffer;
      callback(soundBuffer);
  }, onError);

}
function onError(){
  console.log("ERROR");
}