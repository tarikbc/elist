const express = require('express')
const router = express.Router()
const {
  User
} = require('../db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const schemas = require('../utils/validations/schemas')

router.post('/account', [schemas.auth.account], async (request, response, next) => {
  const { login, password } = request.body
  const query = {}
  if (login && password) {
    // Detecta se é um email ou CPF
    if (login.indexOf('@') > 0) {
      query.email = login
    } else {
      query.cpf = login.replace(/[^0-9]/g, '')
    }
    User.find(query, {
      email: 1,
      cpf: 1,
      type: 1,
      password: 1,
      'stores.storeId': 1,
      'stores.type': 1
    }).limit(1).populate('stores.storeId', { name: 1, photo: 1, city: 1 }).lean()
      .then(async user => {
        if (user.length <= 0) {
          throw {
            status: 401,
            code: 2,
            friendlyMsg: 'Login incorreto.',
            console: false
          }
        }
        if (!await bcrypt.compare(password, user[0].password)) {
          throw {
            status: 401,
            code: 2,
            friendlyMsg: 'Senha incorreta.',
            console: false
          }
        }
        return user[0]
      })
      .then(user => {
        const payload = {
          id: String(user._id),
          type: user.type,
          email: user.email,
          cpf: user.cpf,
          stores: user.stores
        }
        jwt.sign(payload, process.env.JWTSECRET, (err, token) => {
          if (err) {
            next({
              status: 401,
              code: 2,
              friendlyMsg: 'Erro ao gerar token.',
              message: err,
              console: true
            })
          }
          response.json({
            token: token
          })
        })
      })
      .catch(err => {
        next(err)
      })
  } else {
    next({
      status: 401,
      code: 1,
      friendlyMsg: 'Informações insuficientes.'
    })
  }
})

module.exports = router
