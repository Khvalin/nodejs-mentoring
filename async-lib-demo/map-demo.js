/*
1. queue
2. parallel
3. waterfall
4. map

*/

/**
 * Produces a new collection of values by mapping each value in `coll` through
 * the `iteratee` function. The `iteratee` is called with an item from `coll`
 * and a callback for when it has finished processing. Each of these callback
 * takes 2 arguments: an `error`, and the transformed item from `coll`. If
 * `iteratee` passes an error to its callback, the main `callback` (for the
 * `map` function) is immediately called with the error.
 **/

const async = require('async')

async.map(['file1','file2','file3'], fs.stat, function(err, results) {
    // results is now an array of stats for each file
});