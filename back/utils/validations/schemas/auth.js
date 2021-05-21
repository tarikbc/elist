const Joi = require('joi')
const validate = require('./validate')

module.exports.account = (req, res, next) => {
  const schema = Joi.object({
    login: Joi.string()
      .min(6)
      .max(100)
      .required(),
    password: Joi.string()
      .min(6)
      .max(100)
      .required()
  })

  validate.joi(schema, req, next, 401)
}
