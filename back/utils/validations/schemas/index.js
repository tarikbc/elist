const Joi = require('joi')
const validate = require('./validate')

module.exports.auth = require('./auth')
module.exports.store = require('./store')
module.exports.user = require('./user')
module.exports.day = require('./day')

module.exports.period = (req, res, next) => {
  const schema = Joi.object({
    from: Joi.date().iso(),
    to: Joi.date().iso()
  }).and('from', 'to')

  validate.joi(schema, req, next, 400, 'query')
}

module.exports.mongoId = (property = 'id') => (req, res, next) => {
  const schema = Joi.object({
    [property]: validate.mongoId.required()
  })

  validate.joi(schema, req, next, 400, 'params')
}
