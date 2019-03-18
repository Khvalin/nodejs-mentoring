'use strict'

module.exports.helloWorldGet = function helloWorldGet(req, res, next) {
  var name = req.name.value || 'stranger'

  res.send({
    message: `Hello, ${name}!`
  })
}
