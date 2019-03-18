'use strict'

module.exports.createPost = function createPost(req, res, next) {
  res.send({
    message: 'This is the mockup controller for createPost'
  });
};

module.exports.allGet = function allGet(req, res, next) {
  res.send({
    message: 'This is the mockup controller for allGet'
  });
};