
[comment]: # (https://github.com/azat-co/you-dont-know-node)
[comment]: # (https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
[comment]: # (https://nodesource.com/blog/understanding-the-nodejs-event-loop/)


[comment]: # (https://gist.github.com/a0viedo/0de050bb2249757c5def)

# Understanding the Node event loop

## Scheduling Timers
  ### setImmediate(callback[, ...args])
  ### setInterval(callback, delay[, ...args])
  ### setTimeout(callback, delay[, ...args])

## Cancelling Timers
  ### clearImmediate(immediate)
  ### clearInterval(timeout)
  ### clearTimeout(timeout)

## things to cover up?
`nextTick` vs `setImmediate`

Node.js is an event-based platform. This means that everything that happens in Node is the reaction to an event. A transaction passing through Node traverses a cascade of callbacks.
Abstracted away from the developer, this is all handled by a library called libuv which provides a mechanism called an event loop.

## What is the Event Loop?

The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.

![event loop](./event-loop.png "event-loop")




Dispatch in chronological order:

* timer handles (drives `setTimeout` / `setInterval`)
* idle handles (these are pretty much irrelevant to node.js code)
* prepare handles (ditto)
* I/O callbacks (includes polling for new events, may block if no work is queued)
* check handles (drives setImmediate)
* handle close callbacks

Where's `process.nextTick()`? Basically after each of the above steps

## setImmediate() vs setTimeout()
setImmediate and setTimeout() are similar, but behave in different ways depending on when they are called.

* `setImmediate()` is designed to execute a script once the current poll phase completes.
* `setTimeout()` schedules a script to be run after a minimum threshold in ms has elapsed.

```javascript
// timeout_vs_immediate.js

setTimeout(function() {
  console.log("SETTIMEOUT");
}, 0);
setImmediate(function() {
  console.log("SETIMMEDIATE");
});
```

outputs
```bash
> node timeout_vs_immediate.js
SETTIMEOUT
SETIMMEDIATE
> node timeout_vs_immediate.js
SETIMMEDIATE
SETTIMEOUT
```

## The guidelines

If you just want to write JavaScript to run on Node, here's all you need to know.

When you:

* want a function to run soon, but don't want to block the event loop, use
  `setImmediate`
* want a function to always be asynchronous without incurring overhead, use
  `process.nextTick`
* want a function to run x (where x > 1) milliseconds in the future, use
  `setTimeout`

## gotcha #1
### aka "`setImmediate()` is not always very immediate"

https://github.com/nodejs/node-v0.x-archive/issues/5798

`setImmediate()` does what `process.nextTick()` says it does 
but actually doesn't: schedule the callback at the end of the current 
tick / start of the next tick. 

That said, I believe the current `setImmediate()` implementation has a 
bug where it spreads out multiple callbacks over several ticks, i.e. 
one callback per tick.  Tracking issue is 
https://github.com/joyent/node/issues/5798 


```javascript
/// listing 50-setImmediate_vs_nextTick.js

console.log('Program started.');

setImmediate(function() {
  console.log('in immediate.');
  // another tick ends here
});

process.nextTick(function() {
  console.log('in nextTick.');
  // no tick ends here - another process.nextTick
  // would just append to the current tick's queue
});

console.log('end of first tick.');
// first tick ends here
```
![setImmediate vs nextTick order](./img/50-setImmediate_vs_nextTick-result.png "setImmediate vs nextTick order ")

---
## gotcha #2

https://gist.github.com/brycebaril/ff86eeb90b53fd0c523e

@mafintosh asks: "Does anyone have a good code example of when to use `setImmediate` instead of `nextTick`?"

https://twitter.com/mafintosh/status/624590818125352960

The answer is "generally anywhere outside of core".

`process.nextTick` is barely asynchronous. Flow-wise it is asynchronous, but it will trigger before any other asynchronous events can (timers, io, etc.) and thus can starve the event loop.

In this script I show a starved event loop where I just synchronously block, use `nextTick` and `setImmediate`

``` javascript
///listing 51-setImmediate_vs_nextTick.js

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

```

![setImmediate vs nextTick blocking](./img/51-setImmediate_vs_nextTick-result.png "setImmediate vs nextTick blocking")

---

## UV_THREADPOOL_SIZE demo

![event loop](https://i.imgur.com/jKnlmPA.png "UV_THREADPOOL_SIZE")

question: 
webworker VS event loop

NO WEBWORKERS IN NODE :-D


Chapter 3. Building Robust Node Applications
http://chimera.labs.oreilly.com/books/1234000001808/ch03.html#using_multiple_processors

The Event Loop, Web Workers, and Node Clustering
http://slides.com/michaelcole/deck-1-2-4#/


What you should know to really understand the Node.js Event Loop
https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c