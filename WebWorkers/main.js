"use strict";
var foo = "bar";


var piWorker = new Worker("worker.js");
var logResult = function(e) {
  console.log("PI: " + e.data);
};

piWorker.addEventListener("message", logResult, false);
piWorker.postMessage(100000);