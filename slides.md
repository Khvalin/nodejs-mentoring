___
## Title
My name is Constantine,
our topic today is Async development in Node. As you can see this is just an introduction. So we'll cover a lot of basic stuff and just a few more advanced things.

 Once you have a question, type it in and I'll try my best to answer it.
___



___
## Agenda
So here is an agenda for today. First, we'll have a short overview of what Nodejs has got in store for us in terms of async development.

then we'll take a loot at Nodejs internals and see how it actually handles the async functionality.



Also we'll take a look at the 3rd "async" library

___
## sync vs async 

“Metaphor”


In simpler terms:
SYNCHRONOUS
You are in a queue to get a movie ticket. You cannot get one until everybody in front of you gets one, and the same applies to the people queued behind you.
ASYNCHRONOUS
You are in a restaurant with many other people. You order your food. Other people can also order their food, they don't have to wait for your food to be cooked and served to you before they can order. In the kitchen restaurant workers are continuously cooking, serving, and taking orders. People will get their food served as soon as it is cooked.


## When do we need async functions?
so here is a list of operation types which may require an async approach 
they all have something to do with external IO, so we can potentially leverage kernel functions and run them in conjunction with main JS code.  

Node.js itself is single threaded, but some tasks can run parallelly - thanks to its asynchronous nature.
But what does running parallelly mean in practice?
Since we program a single threaded VM, it is essential that we do not block execution by waiting for I/O, but handle them concurrently with the help of Node.js's event driven APIs.


___
## Sync functions

* not production ready
* sync versions of read file and write file are used here
* describe program flow

___
## Callbacks
we can sure do better and copy it in async fasion
one of the most traditional ways of async implementation
CALLBACK HELL

___

## Promises
promisify
McDonalds analogy
helps to resolve callback hell and makes your code look like sync code
we can simply chain them
if an inner callback returns a promise it still gets added to the queue
(writeFileAsync)

___

## Async functions
this is a relatively new approach 
a part of JS syntax
a function marked as async returns a promise
await statements form a chain
looks even more sync

---

## Timers
setTimeout/setInterval are the same as in browser
we can pass additional parameters
setImmediate is implemented in some browsers, but it is still considered as Node specific

---
## Timers ref/unref
timers are ref'ed by default
we don't have it at the browser

## Timers ref/unref
top = ref

---
## Timers ref/unref demo

---

## setTimeout vs setImmediate 
there is a good old pattern of running setTimeout with the delay of 0 in browser
it makes the page more responsive sometimes

---
## setTimeout vs setImmediate Demo
no way to predict which one fires first
UNLESS
---

## setTimeout vs setImmediate 
in this case the order is determinated
we'll see why further

---

## Event Loop
* concurrency pattern!
* JS can do only one thing at a time, but we still can do things concurrently.


---
## ~~EventLoop's~~ Event Loop phases


Dispatch in chronological order:

* timer handles (drives `setTimeout` / `setInterval`)
* I/O callbacks
* idle handles (these are pretty much irrelevant to node.js code)
* prepare handles (ditto)
* I/O polling for new events, may block if no work is queued
* check handles (drives setImmediate)
* handle close callbacks

how queues are formed


---

###nextTick
not a part of libUV! a part of Node

---

## nextTick

Where's `process.nextTick()`? Basically after each of the above steps


## NextTick vs setImmediate  
nextTick starves the Event Loop!

"Does anyone have a good code example of when to use `setImmediate` instead of `nextTick`?"

The answer is "generally anywhere outside of core".

`process.nextTick` is barely asynchronous. Flow-wise it is asynchronous, but it will trigger before any other asynchronous events can (timers, io, etc.) and thus can starve the event loop.

---

## Async library
Async is a utility module which provides straight-forward, powerful functions for working with asynchronous JavaScript

Map
Produces a new collection of values by mapping each value in collection through the function.
fs.stat is async lib

```javascript
async.map(['file1','file2','file3'], fs.stat, function(err, results) {
    // results is now an array of stats for each file
});
``` 

Parallel
Run the tasks collection of functions in parallel, without waiting until the previous function has completed. If any of the functions pass an error to its callback, the main callback is immediately called with the value of the error. Once the tasks have completed, the results are passed to the final callback as an array.

Waterfall
Runs the tasks array of functions in series, each passing their results to the next in the array. However, if any of the tasks pass an error to their own callback, the next function is not executed, and the main callback is immediately called with the error.

---