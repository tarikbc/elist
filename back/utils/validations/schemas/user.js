const Joi = require('joi')
const validate = require('./validate')
const { types } = require('../../constants')

const cpfValidate = Joi.string().length(11).custom((cpfOriginal, helper) => {
  const cpf = cpfOriginal.replace(/[^\d]+/g, '')
  // verificando se tem a quantidade certa de caractere e se não tem todos caracteres iguais
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return helper.error('any.invalid')
  let soma = 0; let resto
  for (var i = 1; i <= 9; i++) soma += parseInt(cpf.substring(i - 1, i)) * (11 - i)
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(cpf.substring(9, 10))) return helper.error('any.invalid')
  soma = 0
  for (var x = 1; x <= 10; x++) soma = soma + parseInt(cpf.substring(x - 1, x)) * (12 - x)
  resto = (soma * 10) % 11
  if ((resto === 10) || (resto === 11)) resto = 0
  if (resto !== parseInt(cpf.substring(10, 11))) return helper.error('any.invalid')
  return String(cpfOriginal)
})

module.exports.cpf = (req, res, next) => {
  const schema = Joi.object({
    cpf: cpfValidate.required()
  })

  validate.joi(schema, req, next, 400, 'params')
}

module.exports.getAllFromStore = (req, res, next) => {
  const schema = Joi.object({
    page: Joi.number(),
    limit: Joi.number(),
    sort: Joi.string().valid(
      'createdAt',
      '-createdAt',
      'name.complete',
      '-name.complete'
    )
  })

  validate.joi(schema, req, next, 400, 'query')
}

module.exports.getOne = (req, res, next) => {
  const schema = Joi.object({
    select: Joi.object({
      password: Joi.number(),
      name: Joi.number(),
      photo: Joi.number(),
      permissions: Joi.number(),
      birthDate: Joi.number(),
      type: Joi.number(),
      gender: Joi.number(),
      cpf: Joi.number(),
      phone: Joi.number(),
      email: Joi.number(),
      stores: Joi.number(),
      createdAt: Joi.number(),
      updatedAt: Joi.number()
    }),
    query: Joi.object().empty(),
    cursor: Joi.object({
      skip: 0,
      limit: 30,
      sort: Joi.object({
        createdAt: -1
      })
    }),
    schema: Joi.any()
  })

  validate.joi(schema, req, next, 400, 'querymen')
}

module.exports.create = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(3).required(),
      last: Joi.string().min(3).required()
    }),
    storeType: Joi.string().valid(...types.everyone),
    email: Joi.string().email().when('storeType', {
      is: Joi.string().valid(...types.topLevel),
      then: Joi.required()
    }),
    cpf: cpfValidate.required(),
    password: Joi.string().min(6).required(),
    storeId: validate.mongoId,
    type: req.user?.type === 'admin' ? Joi.valid('admin', 'user') : Joi.valid('user')
  })

  validate.joi(schema, req, next)
}

module.exports.edit = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.object({
      first: Joi.string().min(3),
      last: Joi.string().min(3)
    }),
    birthDate: Joi.date().iso(),
    gender: Joi.string().valid('male', 'female', 'other'),
    email: Joi.string().email(),
    cpf: cpfValidate,
    phone: Joi.string(),
    password: Joi.string().min(6)
  })

  validate.joi(schema, req, next)
}
