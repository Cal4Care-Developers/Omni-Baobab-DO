//let blob = await fetch("http://localhost:4200/9710f02d-6fd4-464f-ad1f-57f39cb83402").then(r => r.blob());
let audio_stream;
let audio_rec;

const recordButton = document.getElementById("recordButton");
// recordButton.addEventListener("click",startRecording);

// stop recording
const stopButton = document.getElementById("stopButton");
// stopButton.addEventListener("click", stopRecording);
// stopButton.disabled = true;

// set preview
const preview = document.getElementById("audio-playback");
// fetch("http://localhost:4200/audio-playback").then(response => response.blob())
// .then(blob => {
//   const fd = new FormData();
//  console.log(blob)
//   fd.append('operation', 'wp_instance');
//   fd.append('moduleType', 'wp_instance');
//   fd.append('api_type', 'web');
//   fd.append('action', 'whatsapp_upload_voice');
//   fd.append('access_token', access_token);
//   fd.append("audiofile", blob,$('#audio-playback').attr("src"));
//    // alert($('#audio-playback')[0])
//    fd.append('user_id', user_id);
//    fd.append('chat_id', chat_id);
//   // where `.ext` matches file `MIME` type
//   return fetch("https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php", {method:"POST", body:fd})
// })
// .then(response => response.ok)
// .then(res => console.log(res))
// .catch(err => console.log(err));

// const sendAudioFile = _file => {
//     const formData = new FormData();
//    alert('123')
//     formData.append('audiofile',$('#audio-playback').attr("src"));
//     return fetch('https://baobabbfaso.mconnectapps.com/api/v1.0/index_new.php', {
//        method: 'POST',
//        body: formData
//     });
//  };


function startRecording() {
    // button settings
    // alert('kjhj')
    // const recordButton = document.getElementById("recordButton");
    // const stopButton = document.getElementById("stopButton");
    $("#recordButton").hide();
    $("#stopButton").show();
    // recordButton.disabled = true;
    // recordButton.innerText = "recording"
    $("#recordButton").addClass("button-animate");

 $("#stopButton").removeClass("inactive");
//  stopButton.disabled = false;


    if (!$("#audio-playback").hasClass("hidden")) {
        $("#audio-playback").addClass("hidden")
    };
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            audio_stream = stream;
            audio_rec = new MediaRecorder(stream);

            // when there is data, compile into object for preview src
            audio_rec.ondataavailable = function(e) {
                const url = URL.createObjectURL(e.data);
                preview.src = url;

                // set link href as blob url, replaced instantly if re-recorded
                // downloadAudio.href = url;
            };
            audio_rec.start();

            timeout_status = setTimeout(function() {
                console.log("5 min timeout");
                stopRecording();
            }, 300000);
        });
}

function stopRecording() {

    // const recordButton = document.getElementById("recordButton");
    // const stopButton = document.getElementById("stopButton");
    // mediaRecorder.stop();
    audio_rec.stop();
    audio_stream.getAudioTracks()[0].stop();
    $("#recordButton").show();
    $("#stopButton").hide();
    // buttons reset
    // recordButton.disabled = false;
    // recordButton.innerText = "Redo Recording"
    $("#recordButton").removeClass("button-animate");

    $("#stopButton").addClass("active");
    // stopButton.disabled = true;



    // $("#downloadContainer").removeClass("hidden");

}
// const blob = new Blob(url, {
//     'type': 'audio/mp3'
//  });
//  sendAudioFile(blob);
