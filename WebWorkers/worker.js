"use strict";
// our worker, which does some CPU-intensive operation
var reportResult = function(e) {
  //pi = SomeLib.computePiToSpecifiedDecimals(e.data);
  postMessage("message Post Suckah!! " + e);
  console.log(e);
};

onmessage = reportResult;