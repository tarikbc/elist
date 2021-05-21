const Joi = require('joi')
const validate = require('./validate')

module.exports.create = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    cnpj: Joi.string().required(),
    city: Joi.string().required(),
    users: Joi.array()
  })

  validate.joi(schema, req, next)
}
