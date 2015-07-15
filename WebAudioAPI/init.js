// http://www.html5rocks.com/en/tutorials/webaudio/intro/
// http://tech.beatport.com/2014/web-audio/beat-detection-using-web-audio/
// http://www.airtightinteractive.com/2013/10/making-audio-reactive-visuals/


// var context;
// window.addEventListener('load', init, false);

// function init() {
//     try {
//         // Fix up for prefixing
//         window.AudioContext = window.AudioContext || window.webkitAudioContext;
//         context = new AudioContext();
//     } catch (e) {
//         alert('Web Audio API is not supported in this browser');
//     }
// }

var dogBarkingBuffer = null;
// Fix up prefixing
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var context = new AudioContext();

var analyser = context.createAnalyser();
analyser.minDecibels = -90;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.85;
var dataArray;
var bufferLength;

function loadDogSound(url) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, function(buffer) {
      dogBarkingBuffer = buffer;
      playSound(dogBarkingBuffer);
      //funkyShit(dogBarkingBuffer);
    }, function() {
      console.log('err');
    });
  };
  request.send();
}

loadDogSound('ClassicBreaks030.wav');

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  source.loop = true;
  source.buffer = buffer; // tell the source which sound to play
  source.connect(analyser);
  analyser.connect(context.destination);
  //source.connect(context.destination); // connect the source to the context's destination (the speakers)
  source.start(0); // play the source now
  source.onended = function() {
    console.log('Your audio has finished playing');
  };
  // note: on older systems, may have to use deprecated noteOn(time);


  //

  analyser.fftSize = 2048;
  bufferLength = analyser.frequencyBinCount;
  dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  console.log(dataArray);

  draw();
}

var drawVisual;

var canvasCtx = can.getContext("2d");
var WIDTH = 500;
var HEIGHT = 100;

function draw() {

  drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(dataArray);

  //console.clear();
  //console.log(dataArray[100]);

  canvasCtx.fillStyle = 'rgb(200, 200, 200)';
  canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

  canvasCtx.lineWidth = 2;
  canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

  canvasCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = dataArray[i] / 128.0;
    var y = v * HEIGHT / 2;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  canvasCtx.lineTo(can.width, can.height / 2);
  canvasCtx.stroke();
};

// function funkyShit(buffer) {
//   // Create offline context
//   var offlineContext = new OfflineAudioContext(1, buffer.length, buffer.sampleRate);

//   // Create buffer source
//   var source = offlineContext.createBufferSource();
//   source.buffer = buffer;

//   // Create filter
//   var filter = offlineContext.createBiquadFilter();
//   filter.type = "lowpass";

//   // Pipe the song into the filter, and the filter into the offline context
//   source.connect(filter);
//   filter.connect(offlineContext.destination);

//   // Schedule the song to start playing at time:0
//   source.start(0);

//   // Render the song
//   offlineContext.startRendering()

//   // Act on the result
//   offlineContext.oncomplete = function(e) {
//     // Filtered buffer!
//     var filteredBuffer = e.renderedBuffer;
//     console.log(filteredBuffer);
//   };
// }