'use strict';

module.exports = {
  all,
  create
};


const MESSAGES = [ { user: 'Alice', text: 'hello' }, { user: 'Bob', text: 'hi' } ];

function all(req, res) {
   res.json(MESSAGES);
}

function create(req, res) {
  MESSAGES.unshift(req.swagger.params.message.value);
  res.json(MESSAGES);
}
