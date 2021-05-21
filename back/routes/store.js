const express = require('express')
const router = express.Router()
const { Store } = require('../db')
const _ = require('lodash')
const query = require('querymen').middleware
const validations = require('../utils/validations')
const schemas = require('../utils/validations/schemas')
const security = require('../utils/security')

router.get('/:id', [security.auth(), query(), validations.validID()], (request, response, next) => {
  if (request.user.stores.map(store => String(store.storeId)).includes(request.params.id) || request.user.type === 'admin') {
    Store.find({ _id: request.params.id }, request.querymen.select).limit(1)
      .populate('users', {
        name: 1,
        photo: 1,
        stores: 1,
        email: 1
      })
      .lean().exec()
      .then(data => {
        if (_.isEmpty(data)) {
          next({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
            console: false
          })
        } else {
          response.status(200).json(data[0])
        }
      })
      .catch(err => next(err))
  } else {
    next({
      status: 401,
      code: 6,
      friendlyMsg: 'Você não tem permissão de acessar essas informações.',
      message: 'Usuário sem permissão de acesso.'
    })
  }
})

router.post('/', [schemas.store.create], async (request, response, next) => {
  Store.create(request.body)
    .then(data => {
      response.json({
        id: data._id
      })
    })
    .catch(err => next(err))
})

module.exports = router
