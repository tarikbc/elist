const express = require('express')
const router = express.Router()
const { User, Store } = require('../db')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const query = require('querymen').middleware
const validations = require('../utils/validations')
const schemas = require('../utils/validations/schemas')
const security = require('../utils/security')
const moment = require('moment')

router.get('/cpf/:cpf', [schemas.user.cpf], function (request, response, next) {
  User.find({ cpf: request.params.cpf, type: 'user' }, { cpf: 1, name: 1 }).limit(1).lean().then(userDB => {
    response.json(userDB.length > 0 ? { found: true, ...userDB[0] } : { found: false })
  }).catch(err => next(err))
})

router.get('/store/:storeId', [schemas.user.getAllFromStore, query(), security.permit.store.userIsLinked()], ({ querymen: { query, select, cursor }, params }, response, next) => {
  const { storeId } = params
  query = {
    'stores.storeId': storeId
  }
  const thisMonth = moment().locale('pt-BR').set({ date: 1, hour: process.env.NODE_ENV !== 'production' ? 12 : 15, minute: 0, second: 0, millisecond: 0 })
  User.paginate(query, {
    select: {
      photo: 1,
      name: 1,
      stores: 1,
      email: 1,
      birthDate: 1,
      phone: 1,
      cpf: 1,
      gender: 1
    },
    sort: cursor.sort,
    page: (cursor.skip / cursor.limit) + 1,
    limit: cursor.limit || 10
  }).then(data => {
    response.json({
      items: data.docs.map(user => {
        return {
          ...user.toObject(),
          stores: user.stores.filter(store => String(store.storeId) === storeId),
        }
      }),
      metadata: {
        pagination: {
          currentPage: Number(data.page) || 1,
          pageCount: data.totalPages,
          totalCount: data.totalDocs || 0,
          limit: data.limit
        },
        sorting: cursor.sort
      }
    })
  }).catch(err => next(err))
})

router.get('/:userId', [schemas.mongoId('userId'), query(), schemas.user.getOne], (request, response, next) => {
  if (request.params.userId === request.user.id || request.user.type === 'admin') {
    const { password, ...select } = request.querymen.select
    User.find({ _id: request.params.userId }, select).limit(1).populate('stores.storeId', { name: 1, photo: 1, city: 1 }).lean().exec()
      .then(data => {
        if (data.length > 0) {
          response.status(200).json(data[0])
        } else {
          next({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
            console: false
          })
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

router.post('/', [schemas.user.create, security.permit.user.create], async (request, response, next) => {
  try {
    const newUser = {
      stores: [],
      ...request.body
    }
    newUser.password = await bcrypt.hash(request.body.password, security.BCRYPT_SALT_ROUNDS)
    newUser.name.complete = `${request.body.name.first} ${request.body.name.last}`
    const user = await User.create(newUser)
    if (newUser.storeType && newUser.storeId) {
      const store = await Store.find({ _id: newUser.storeId }, { users: 1 }).limit(1).exec()
      if (store.length <= 0) {
        next({
          status: 401,
          code: 2,
          friendlyMsg: 'Informações incorretas',
          console: false
        })
      } else {
        store[0].users.push(user._id)
        user.stores.push({
          storeId: newUser.storeId,
          code: newUser.code,
          type: newUser.storeType,
          joinedAt: new Date()
        })
        await Promise.all([
          store[0].save(),
          user.save()
        ])
        response.json({
          _id: user._id,
          photo: user.photo,
          name: user.name,
          stores: user.stores,
          email: user.email,
          cpf: user.cpf
        })
      }
    }
  } catch (err) {
    next(err)
  }
})

router.put('/:id', [schemas.user.edit, security.permit.user.edit], async (request, response, next) => {
  if (Object.keys(request.body).length > 0) {
    if (request.body.password) request.body.password = await bcrypt.hash(request.body.password, security.BCRYPT_SALT_ROUNDS)
    if (request.body.type) delete request.body.type
    if (request.body.birthDate) request.body.birthDate = moment(request.body.birthDate).utcOffset(0).set({ hour: process.env.NODE_ENV !== 'production' ? 12 : 15, minute: 0, second: 0, millisecond: 0 }).toISOString()
    if (request.body.name && request.body.name.first && request.body.name.last) request.body.name.complete = request.body.name.first + ' ' + request.body.name.last

    User.findByIdAndUpdate(request.params.id, request.body, { new: true }).exec()
      .then(user => user.populate('stores.storeId', { name: 1, photo: 1, city: 1 }).execPopulate())
      .then((data) => {
        response.json({
          _id: data._id,
          name: data.name,
          birthDate: data.birthDate,
          gender: data.gender,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          stores: data.stores,
          photo: data.photo
        })
      })
      .catch(err => {
        err.friendlyMsg = 'Erro ao atualizar informações.'
        next(err)
      })
  } else {
    next({
      status: 401,
      code: 2,
      friendlyMsg: 'Nenhuma propriedade válida no body.',
      console: false
    })
  }
})

module.exports = router
