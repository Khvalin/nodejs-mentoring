
[comment]: # (https://github.com/azat-co/you-dont-know-node)
[comment]: # (https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/)
[comment]: # (https://nodesource.com/blog/understanding-the-nodejs-event-loop/)
[comment]: # (https://gist.github.com/a0viedo/0de050bb2249757c5def)

# Understanding the Node event loop

## things to cover up?
`nextTick` vs `setImmediate`

Node.js is an event-based platform. This means that everything that happens in Node is the reaction to an event. A transaction passing through Node traverses a cascade of callbacks.
Abstracted away from the developer, this is all handled by a library called libuv which provides a mechanism called an event loop.

## What is the Event Loop?

The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that JavaScript is single-threaded — by offloading operations to the system kernel whenever possible.

![event loop](./event-loop.png "haha")




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

## setImmediate gotcha #1
### aka "`setImmediate()` is not always very immediate"

https://github.com/nodejs/node-v0.x-archive/issues/5798

?? `setImmediate()` does what `process.nextTick()` says it does 
but actually doesn't: schedule the callback at the end of the current 
tick / start of the next tick. 

That said, I believe the current `setImmediate()` implementation has a 
bug where it spreads out multiple callbacks over several ticks, i.e. 
one callback per tick.  Tracking issue is 
https://github.com/joyent/node/issues/5798 


## Thread pool work scheduling
http://docs.libuv.org/en/v1.x/threadpool.html

libuv provides a threadpool which can be used to run user code and get notified in the loop thread. **This thread pool is internally used to run all file system operations, as well as getaddrinfo and getnameinfo requests.**

Its default size is 4, but it can be changed at startup time by setting the UV_THREADPOOL_SIZE environment variable to any value (the absolute maximum is 128).

The threadpool is global and shared across all event loops. When a particular function makes use of the threadpool (i.e. when using uv_queue_work()) libuv preallocates and initializes the maximum number of threads allowed by UV_THREADPOOL_SIZE. This causes a relatively minor memory overhead (~1MB for 128 threads) but increases the performance of threading at runtime.

Libuv by default creates a thread pool with four threads to offload asynchronous work to. Today’s operating systems already provide asynchronous interfaces for many I/O tasks (e.g. AIO on Linux).
Whenever possible, libuv will use those asynchronous interfaces, avoiding usage of the thread pool. The same applies to third party subsystems like databases. Here the authors of the driver will rather use the asynchronous interface than utilizing a thread pool.
In short: Only if there is no other way, the thread pool will be used for asynchronous I/O.
( https://medium.com/the-node-js-collection/what-you-should-know-to-really-understand-the-node-js-event-loop-and-its-metrics-c4907b19da4c )


## Implementation considerations

Although dns.lookup() and the various dns.resolve*()/dns.reverse() functions have the same goal of associating a network name with a network address (or vice versa), their behavior is quite different. These differences can have subtle but significant consequences on the behavior of Node.js programs.
dns.lookup()
#

Under the hood, dns.lookup() uses the same operating system facilities as most other programs. For instance, dns.lookup() will almost always resolve a given name the same way as the ping command. On most POSIX-like operating systems, the behavior of the dns.lookup() function can be modified by changing settings in nsswitch.conf(5) and/or resolv.conf(5), but note that changing these files will change the behavior of all other programs running on the same operating system.

Though the call to dns.lookup() will be asynchronous from JavaScript's perspective, it is implemented as a synchronous call to getaddrinfo(3) that runs on libuv's threadpool. Because libuv's threadpool has a fixed size, it means that if for whatever reason the call to getaddrinfo(3) takes a long time, other operations that could run on libuv's threadpool (such as filesystem operations) will experience degraded performance. In order to mitigate this issue, one potential solution is to increase the size of libuv's threadpool by setting the 'UV_THREADPOOL_SIZE' environment variable to a value greater than 4 (its current default value). For more information on libuv's threadpool, see the official libuv documentation.

https://gist.github.com/owenallenaz/fc3d8b24cdaa4ec04cc9dd0bf8ab485f#file-dnsserver-js

question: 
webworker VS event loop
