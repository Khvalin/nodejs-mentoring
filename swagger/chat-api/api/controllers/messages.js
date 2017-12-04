'use strict';

module.exports = {
  all
};

const MESSAGES = [ { user: 'Alice', text: 'hello' }, { user: 'Bob', text: 'hi' } ];

function all(req, res) {
  res.json(MESSAGES);
}
