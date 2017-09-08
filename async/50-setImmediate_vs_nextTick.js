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
