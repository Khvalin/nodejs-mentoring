var loops = 11
function run() {
  loops--
  for (var i = 0; i < 1e7; i++) {
    Math.pow(Math.random(), Math.random())
  }
  if (loops > 0) {
    if (process.argv[2] == "blocked") {
      run()
    }
    if (process.argv[2] == "nexttick") {
      process.nextTick(run)
    }
    if (process.argv[2] == "setimmediate") {
      setImmediate(run)
    }
  }
}

var delay = 10
var start = process.hrtime()
setTimeout(function () {
  var elapsed = process.hrtime(start)
  var ms_elapsed = (elapsed[0] * 1000) + (elapsed[1] / 1e6)
  console.log("I took %sms, expected to take %s", ms_elapsed, delay)
}, delay)

run()
