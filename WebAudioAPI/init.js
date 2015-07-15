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
var tdDataArray;
var freqDataArray;
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
    }, function() {
      console.log('err');
    });
  };
  request.send();
}

loadDogSound('ClassicBreaks030.wav');

function playSound(buffer) {
  var source = context.createBufferSource(); // creates a sound source
  // source.loop = true;
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
  tdDataArray = new Uint8Array(bufferLength);
  freqDataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(tdDataArray);

  console.log(tdDataArray);

  drawTD();
  drawFreq();
}

var drawVisual;
var tdCtx = tdcan.getContext("2d");
var WIDTH = 500;
var HEIGHT = 100;

function drawTD() {

  //drawVisual = requestAnimationFrame(draw);

  analyser.getByteTimeDomainData(tdDataArray);

  tdCtx.fillStyle = 'rgb(200, 200, 200)';
  tdCtx.fillRect(0, 0, WIDTH, HEIGHT);

  tdCtx.lineWidth = 2;
  tdCtx.strokeStyle = 'rgb(0, 0, 0)';

  tdCtx.beginPath();

  var sliceWidth = WIDTH * 1.0 / bufferLength;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {

    var v = tdDataArray[i] / 128.0;
    var y = v * HEIGHT / 2;

    if (i === 0) {
      tdCtx.moveTo(x, y);
    } else {
      tdCtx.lineTo(x, y);
    }

    x += sliceWidth;
  }

  tdCtx.lineTo(tdcan.width, tdcan.height / 2);
  tdCtx.stroke();
};

var drawFreqVisual;
var freqCtx = freqcan.getContext("2d");

function drawFreq() {
  //console.log('drawfreq');
  //drawFreqVisual = requestAnimationFrame(drawFreq);

  analyser.getByteFrequencyData(freqDataArray);

  freqCtx.fillStyle = 'rgb(0, 0, 0)';
  freqCtx.fillRect(0, 0, WIDTH, HEIGHT);

  var barWidth = (WIDTH / bufferLength) * 2.5;
  var barHeight;
  var x = 0;

  for (var i = 0; i < bufferLength; i++) {
    barHeight = freqDataArray[i];

    freqCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
    freqCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

    x += barWidth + 1;
  };
}