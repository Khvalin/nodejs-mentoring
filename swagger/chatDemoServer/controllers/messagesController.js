'use strict'

var varmessagesController = require('./messagesControllerService')

module.exports.createPost = function createPost(req, res, next) {
  console.log(req.swagger)
  varmessagesController.createPost(req.swagger.params, res, next)
}

module.exports.allGet = function allGet(req, res, next) {
  varmessagesController.allGet(req.swagger.params, res, next)
}
