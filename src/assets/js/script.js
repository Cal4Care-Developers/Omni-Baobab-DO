

let log = console.log.bind(console),
  id = val => document.getElementById(val),
  ul = id('ul'),
  gUMbtn = id('gUMbtn'),
  start = id('start'),
  stop = id('stop'),
  stream,
  recorder,
  counter=1,
  chunks,
  media;


// gUMbtn.onclick = e => {
//   let mv = id('mediaVideo'),
//       mediaOptions = {
//         video: {
//           tag: 'video',
//           type: 'video/webm',
//           ext: '.mp4',
//           gUM: {video: true, audio: true}
//         },
//         audio: {
//           tag: 'audio',
//           type: 'audio/ogg',
//           ext: '.ogg',
//           gUM: {audio: true}
//         }
//       };
//   media = mv.checked ? mediaOptions.video : mediaOptions.audio;
//   navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
//     stream = _stream;
//     id('gUMArea').style.display = 'none';
//     id('btns').style.display = 'inherit';
//     start.removeAttribute('disabled');
//     recorder = new MediaRecorder(stream);
//     recorder.ondataavailable = e => {
//       chunks.push(e.data);
//       if(recorder.state == 'inactive')  makeLink();
//     };
//     log('got media successfully');
//   }).catch(log);
// }






function medi(){


  let start = document.getElementById('start');

  media = {
    tag: 'audio',
    type: 'audio/wav',
    ext: '.wav',
    gUM: {audio: true}
  };



  navigator.mediaDevices.getUserMedia(media.gUM).then(_stream => {
    stream = _stream;
    id('gUMArea').style.display = 'none';
    id('btns').style.display = 'inherit';
    start.removeAttribute('disabled');
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = e => {
      chunks.push(e.data);
      if(recorder.state == 'inactive')  makeLink();
    };
    console.log(recorder);
    log('got media successfully');
  }).catch(log);
}




function mediStart(){


  let start = document.getElementById('start');
  let stop = document.getElementById('stop');
  let ul = document.getElementById('ul');
  let gUMbtn = document.getElementById('gUMbtn');

  start.disabled = true;
  stop.removeAttribute('disabled');
  chunks=[];
  recorder.start();
}



function mediStop (){
 let start = document.getElementById('start');
  let stop = document.getElementById('stop');
  let ul = document.getElementById('ul');
  let gUMbtn = document.getElementById('gUMbtn');


  stop.disabled = true;
  recorder.stop();
  start.removeAttribute('disabled');
}





function makeLink(){

  let start = document.getElementById('start');
  let stop = document.getElementById('stop');
  let ul = document.getElementById('ul');
  let gUMbtn = document.getElementById('gUMbtn');


  let blob = new Blob(chunks, {type: media.type })
    , url = URL.createObjectURL(blob)
    , li = document.createElement('li')
    , mt = document.createElement(media.tag)
    , hf = document.createElement('a')
    , hi = document.createElement('INPUT')
  ;

  var wavefilefromblob = new File([blob], 'filename.wav');

  mt.controls = true;
  mt.src = url;
  hf.href = url;
  hf.id=`wav${counter++}`;
  hf.download = `${counter++}${media.ext}`;
  hf.innerHTML = `donwload ${hf.download}`;
  hi.type = 'file';
  hi.id = 'rasUrl';
  li.appendChild(mt);
  li.appendChild(hf);
  ul.appendChild(li);
}


