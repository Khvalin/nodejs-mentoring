'use strict'

const CHAT_MESSAGES = [ { user: 'Alice', text: 'hello' }, { user: 'Bob', text: 'hi' } ]

module.exports.createPost = function createPost(req, res, next) {
  // Body parameter in v3 has no name ( https://github.com/OAI/OpenAPI-Specification/issues/1643 )
  const { user, text } = req.undefined.value
  CHAT_MESSAGES.unshift({ user, text })

  res.send(CHAT_MESSAGES)
}

module.exports.allGet = function allGet(req, res, next) {
  res.send(CHAT_MESSAGES)
}
