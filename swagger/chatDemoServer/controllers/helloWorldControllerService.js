'use strict'

module.exports.helloWorldGet = function helloWorldGet(req, res, next) {
  res.send({
    message: 'This is the mockup controller for helloWorldGet'
  });
};