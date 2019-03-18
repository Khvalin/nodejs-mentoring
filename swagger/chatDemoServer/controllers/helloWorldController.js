'use strict'

var varhelloWorldController = require('./helloWorldControllerService');

module.exports.helloWorldGet = function helloWorldGet(req, res, next) {
  varhelloWorldController.helloWorldGet(req.swagger.params, res, next);
};