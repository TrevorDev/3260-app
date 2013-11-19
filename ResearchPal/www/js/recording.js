var mediaVar = null;
var recordFileName = "recording.mp3";
var status = null;
var fullUploadPath = null;
var mediaTimer = null;

$(document).ready(function(){
    var recordBtn = $('#recordButton');
    var stopBtn = $('#stopButton');
    var playBtn = $('#playButton');
    var sendRecBtn = $('#sendRecordingBtn');

    getGPSLocation(function(latitude, longitude){
        updateRecordingLabel("latitude " + latitude + " longitude " + longitude);
    });

    recordBtn.click(function(){
        record();
        recordBtn.hide();
        stopBtn.show();
    });

    stopBtn.click(function(){
        stop();
        stopBtn.hide();
        playBtn.show();
        sendRecBtn.show();
    });

    playBtn.click(function(){
        play();
        playBtn.hide();
        stopBtn.show();
    });

    sendRecBtn.click(function(){
        sendRecording();
        sendRecBtn.hide();
        stopBtn.hide();
        playBtn.hide();
        recordBtn.show();
    });
});

function play(){
    if (mediaVar != null){
      mediaVar.release();
    }

    var src= fullUploadPath;
    mediaVar = new Media(src, function(){
            log("Media created successfully");
        }, onError, null);

    mediaVar.play();
    status = "playing";

    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            mediaVar.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        updateRecordingLabel((position) + " sec");
                    } else {
                        stopBtn.click();
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    updateRecordingLabel("Error: " + e);
                }
            );
        }, 1000);
    }
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

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){

        fileSystem.root.getFile(recordFileName, {
            create: true,
            exclusive: false
        }, function(fileEntry){
            fullUploadPath = fileEntry.fullPath;
            mediaVar = new Media(recordFileName, function(){
                log("Android media created successfully");
            }, onError, mediaStatusCallback);
            onMediaCreated();
        }, onError); //of getFile
    }, onError); //of requestFileSystem
}

function stop() {
    if (mediaVar == null)
        return;

    if (status == 'recording') {
        mediaVar.stopRecord();
        updateRecordingLabel("Recording stopped");
    }
    else if (status == 'playing') {
        mediaVar.stop();
        updateRecordingLabel("Play stopped");
    } else {
        updateRecordingLabel("Nothing stopped");
    }
    status = 'stopped';
}

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

function sendRecording(){
    var file = new FileTransfer();
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fullUploadPath.substr(fullUploadPath.lastIndexOf('/')+1);
    options.mimeType = 'audio/mpeg3';
    options.chunkedMode = false;
    options.headers = {'Content-Type': 'multipart/form-data; boundary=+++++'};

    getGPSLocation(function(latitude, longitude){
        var params = new Object();
        params.latitude = latitude;
        params.longitude = longitude;

        options.params = params;


        file.upload(fullUploadPath, encodeURI("http://131.104.48.208/newRecording"), function(success){
                if (success = "success"){
                    updateRecordingLabel('Recording sent!');
                    // TODO: Delete recording here.
                } else {
                    updateRecordingLabel('Failed to send the recording to the server. Check your connection.');
                }
            }, onError, options);
    });

    return false;
}

function getGPSLocation(callback){
    navigator.geolocation.getCurrentPosition(function(position){
        callback(position.coords.latitude, position.coords.longitude);
    }, onError);
}