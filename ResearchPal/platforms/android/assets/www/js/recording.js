/*********************************************************************
* PROJECT: ResearchPal
* FILE NAME: recording.js
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
*   Contains the functions for recording system.
*********************************************************************/

var mediaVar = null;
var recordFileName = "recording.mp3";
var fullUploadPath = null;
var mediaTimer = null;
var recordBtn;
var stopBtn;
var stopRecordingBtn;
var playBtn;
var sendRecBtn;

$(document).ready(function(){
    recordBtn = $('#recordButton');
    stopBtn = $('#stopButton');
    stopRecordingBtn = $('#stopRecordingButton');
    playBtn = $('#playButton');
    sendRecBtn = $('#sendRecordingBtn');

    recordBtn.click(function(){
        $('.footer-bar').slideUp();
        record();
    });
    stopRecordingBtn.click(function(){
        stopRecording();
    })
    stopBtn.click(function(){
        stop();
    });

    playBtn.click(function(){
        play();
    });

    sendRecBtn.click(function(){
        disableSend();
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        //alert('Connection type: ' + states[networkState]);
        if (navigator.connection.type == Connection.NONE)
        {
            alert('No network connection');
            enableSend();
            return false;
        }

        if (navigator.connection.type == Connection.WIFI)
        {
            onConfirm(1);
            return;
        }
        showConfirm();


    });
});

function showConfirm() {
    navigator.notification.confirm(
        'Are you sure send the message over your data plan?',  // message
        onConfirm,              // callback to invoke with index of button pressed
        'WIFI Warning',            // title
        ['Confirm', 'Cancel']          // buttonLabels
    );
}

function onConfirm(btnPressed) {
    if (btnPressed == 1){
        sendRecording();
    }
}

function play(){
    if (mediaVar != null){
      mediaVar.release();
    }

    var src= fullUploadPath;
    mediaVar = new Media(src, function(){
            log("Media created successfully");
        }, onError, null);

    mediaVar.play();

    playBtn.hide();
    stopBtn.show();

    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            var totalLength = mediaVar.getDuration();
            mediaVar.getCurrentPosition(
                // success callback
                function(position) {
                    position = Math.round(position);
                    if (position < totalLength && position != 0) {
                        updateRecordingLabel((position) + " sec");
                    } else {
                        stopBtn.hide();
                        playBtn.show();
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
    console.log("Recording button clicked");
    if (mediaVar != null) {
        mediaVar.release();
    }
    createMedia(function(){
        console.log("Starting to record");
        mediaVar.startRecord();
        updateRecordingLabel("recording");
        // Show stopRecording button
        recordBtn.hide();
        stopRecordingBtn.show();
    },onStatusChange);
}

function createMedia(onMediaCreated, mediaStatusCallback){
    console.log("Attempting to create media");

    if (mediaVar != null) {
        console.log("Media var already exists.");
        onMediaCreated();
        return;
    }

    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem){
        console.log("Requesting file system");
        fileSystem.root.getFile(recordFileName, {
            create: true,
            exclusive: false
        }, function(fileEntry){
            fullUploadPath = fileEntry.fullPath;
            console.log("Attempting to create new media object");
            mediaVar = new Media(recordFileName, function(){
                log("Successful action");
            }, onError, mediaStatusCallback);
            console.log("Recording");
            onMediaCreated();
        }, onError); //of getFile
    }, onError); //of requestFileSystem
}

function stopRecording(){
    if (mediaVar != null){
        mediaVar.stopRecord();
        updateRecordingLabel("Recording stopped");

        // Hide stop button
        stopRecordingBtn.hide();
        recordBtn.show();
        resetSendBtn();
        $('.footer-bar').slideDown();
    }
}
function stop() {
    if (mediaVar == null)
        return;

    mediaVar.stop();
    clearInterval(mediaTimer);
    mediaTimer = null;
    updateRecordingLabel("Play stopped");

    // hide stop button show play button.
    stopBtn.hide();
    playBtn.show();
}

function onStatusChange(status){
    var msg;
    switch (status){
        case Media.MEDIA_NONE:
            msg = "Media None?";
            break;
        case Media.MEDIA_STARTING:
            msg = "Playing";
            break;
        case Media.MEDIA_RUNNING:
            msg= "Running";
            break;
        case Media.MEDIA_PAUSED:
            msg = "Paused";
            break;
        case Media.MEDIA_STOPPED:
            msg = "Stopped";
            break;
        default:
            console.log("Unknown media status");
            break;
    }
    updateRecordingLabel(msg);
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
                    onSent();
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

function onSent(){
    sendRecBtn.attr('disabled', 'disabled');
    sendRecBtn.removeClass('btn-info');
    sendRecBtn.addClass('btn-success');
    sendRecBtn.html('Sent!');

    $('.footer-bar').slideUp();
    $('.infoPanel').slideDown();
    setTimeout(function(){ $('.infoPanel').slideUp(); },2000);

    enableSend();
}

function resetSendBtn(){
    sendRecBtn.removeAttr('disabled');
    sendRecBtn.removeClass('btn-success');
    sendRecBtn.addClass('btn-info');
    sendRecBtn.html('Send');
}

function disableSend(){
    sendRecBtn.attr('disabled', 'disabled');
    sendRecBtn.html('Sending...');
}

function enableSend(){
    resetSendBtn();
}