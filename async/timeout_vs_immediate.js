// timeout_vs_immediate.js

setTimeout(function() {
  console.log("SETTIMEOUT");
});
setImmediate(function() {
  console.log("SETIMMEDIATE");
});