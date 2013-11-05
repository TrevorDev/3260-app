function playRecording(file){
    mediaVar = new Media(file, function(){
          log("Media created successfully");
    }, onError);
    mediaVar.play();
}

var mediaVar = null;
var recordFileName = "recording.wav";
var status = null;

$(document).ready(function(){
    $('#recordButton').click(function(){
        record();
    });

    $('#stopButton').click(function(){
        stop();
    });

    $('#playButton').click(function(){
        play();
    });
});

function play(){
    if (mediaVar != null){
      mediaVar.release();
    }

    var src="/data/data/com.phonegap.hello_world/cache/" +recordFileName;
    mediaVar = new Media(src, function(){
            log("Media created successfully");
        }, onError, null); 

    mediaVar.play();
}
function recordingSuccess(){
    console.log("Started recording");
}

function recordingError(error){
    alert('code: ' + error.code + "message: " + error.message);
}

function updateRecordingLabel(message){
    $('#recordingLabel').html(message);
}

function record(){
    if (mediaVar != null) {
        mediaVar.release();
    }
    createMedia(function(){
        status = "recording";
        mediaVar.startRecord();
        updateRecordingLabel(status);
    },onStatusChange);
}

function createMedia(onMediaCreated, mediaStatusCallback){
    if (mediaVar != null) {
        onMediaCreated();
        return;
    }
    mediaVar = new Media(recordFileName, function(){
        log("Media created successfully");
    }, onError, mediaStatusCallback); 
    onMediaCreated();
}

function stop() {
    if (mediaVar == null)
        return;

    if (status == 'recording') {
        mediaVar.stopRecord();
        log("Recording stopped");
    }
    else if (status == 'playing') {
        mediaVar.stop();
        log("Play stopped");
    } else {
        log("Nothing stopped");
    }
    status = 'stopped';
    updateRecordingLabel(status);
}
/*
function play(){
    createMedia(function(){
      status = "playing";
      mediaVar.play();
      updateRecordingLabel(status);
    });
}
*/
function onStatusChange(){
}

function onSuccess(){
    //do nothing
}

function onError(err){
    if (typeof err.message != 'undefined')
        err = err.message;
    alert("Error : " + err);
}

function log(message){
    console.log(message);
}
