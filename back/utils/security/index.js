const permit = require('./permission/')
const { User } = require('../../db')
const jwt = require('jsonwebtoken')

// middleware para verificar token JWT
module.exports.auth = (block = true) => {
  return (request, response, next) => {
    if (request.token) {
      jwt.verify(request.token, process.env.JWTSECRET, (err, payload) => {
        if (err) {
          return next({
            status: 401,
            code: 2,
            friendlyMsg: 'Token inválido.',
            message: err,
            console: true,
            suspect: true
          })
        }
        User.find({
          _id: payload.id
        }, {
          type: 1,
          password: 1,
          name: 1,
          phone: 1,
          stores: 1
        }).limit(1).lean().exec()
          .then(user => {
            if (user.length === 1) {
              request.user = {
                id: String(user[0]._id),
                type: user[0].type,
                name: user[0].name,
                phone: user[0].phone,
                stores: user[0].stores
              }
              next()
            } else {
              next({
                status: 400,
                code: 5,
                friendlyMsg: 'Usuário do token não encontrado.',
                console: false
              })
            }
          })
          .catch(err => {
            next({
              status: 400,
              code: 5,
              message: err,
              friendlyMsg: 'Usuário do token não encontrado.',
              console: false
            })
          })
      })
    } else {
      block ? next({
        status: 401,
        code: 2,
        friendlyMsg: 'Token não informado.',
        message: 'Usuário tentou acessar rota sem informar token.',
        suspect: true,
        console: true
      }) : next()
    }
  }
}

module.exports.BCRYPT_SALT_ROUNDS = 6
module.exports.permit = permit
