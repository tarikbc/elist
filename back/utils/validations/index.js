const { check, validationResult } = require('express-validator')
const _ = require('lodash')

const validationsErrorHandle = (request, response, next) => {
  const errors = validationResult(request).array()
  if (errors.length > 0) {
    next({
      status: 400,
      code: 4,
      friendlyMsg: errors[0].msg,
      validation: errors,
      console: false,
      suspect: _.some(errors, { msg: 'Formato inválido.' })
    })
  }
  next()
}

const validations = {
  validID: (idName = 'id') => [
    check(idName).isMongoId().withMessage('Formato inválido.'),
    validationsErrorHandle
  ],
  validStoreID: [
    check('storeId').isMongoId().withMessage('Formato inválido.'),
    validationsErrorHandle
  ],
  validStoreAndUserID: [
    check('storeId').isMongoId().withMessage('Formato inválido.'),
    check('userId').isMongoId().withMessage('Formato inválido.'),
    validationsErrorHandle
  ],
  validEmail: [
    check('email').isEmail().withMessage('Email inválido.'),
    validationsErrorHandle
  ],
  fcm: [
    check('fcm').isString().withMessage('Formato inválido.'),
    validationsErrorHandle
  ]
}

module.exports = validations
