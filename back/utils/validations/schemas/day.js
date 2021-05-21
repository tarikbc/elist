const Joi = require('joi')
const validate = require('./validate')

module.exports.create = (req, res, next) => {
  const schema = Joi.object({
    activities: Joi.array().items(
      Joi.object({
        type: Joi.string().required().valid(
          'start',
          'end',
          'end_operational',
          'end_food',
          'end_coffee',
          'end_bathroom',
          'end_external'
        ),
        sellerId: validate.mongoId.required(),
        date: Joi.date().iso().required()
      })
    ),
    events: Joi.array().items(
      Joi.object({
        entryType: Joi.string().required().valid(
          'normal',
          'out_client',
          'out_operational',
          'out_return'
        ),
        success: Joi.boolean().required(),
        period: Joi.object({
          start: Joi.date().iso().required(),
          end: Joi.date().iso().required()
        }).required(),
        selected: Joi.object({
          title: Joi.string().max(150).required(),
          options: Joi.array().items(Joi.link('...'))
        }),
        sellerId: validate.mongoId.required().required()
      })
    )
  })

  validate.joi(schema, req, next)
}
