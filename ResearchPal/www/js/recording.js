var mediaVar = null;
var recordFileName = "recording.wav";
var status = null;
var fullRecordPath = null;
var fullUploadPath = null;

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

    $('#sendRecordingBtn').click(function(){
        sendRecording();
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
            log("---------> Android File " + recordFileName + " created at " + fileEntry.fullPath);
            fullRecordPath = recordFileName;
            fullUploadPath = fileEntry.fullPath;
            mediaVar = new Media(recordFileName, function(){
                log("Android media created successfully");
            }, onError, mediaStatusCallback);
            onMediaCreated();
        }, onError); //of getFile
    }, onError); //of requestFileSystem

    /* mediaVar = new Media(recordFileName, function(){
        log("Media created successfully");
    }, onError, mediaStatusCallback); 
    onMediaCreated();
    */
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

var win = function (r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);

    updateRecordingLabel('Recording sent!');
}

var fail = function (error) {
    alert("An error has occurred: Code = " + error.code);
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}
function sendRecording(){

    var file = new FileTransfer();
    var options = new FileUploadOptions();

    options.fileKey = "file";
    options.fileName = fullUploadPath.substr(fullUploadPath.lastIndexOf('/')+1);
    options.mimeType = 'audio/wav';
    options.chunkedMode = false;
    options.headers = {'Content-Type': 'multipart/form-data; boundary=+++++'};

    log("PATH " + fullUploadPath);
    file.upload(fullUploadPath, encodeURI("http://131.104.48.208/newRecording"), win, fail, options);

    /*$.ajax({
    type: "POST",
    url: 'http://131.104.48.208/newRecording',
    crossDomain: true,
    data:{ "test" : "YAY"},
    success: function(data) {
        updateRecordingLabel("Recording sent " + data);
    },
        error: onError
    });
*/
    return false;
}