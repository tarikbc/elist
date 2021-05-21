module.exports.user = require('./user')
module.exports.store = require('./store')
module.exports.day = require('./day')

module.exports.role = function (...allowed) {
  return (req, res, next) => {
    req.user.id && allowed.indexOf(req.user.type) > -1 ? next()
      : next({
        status: 401,
        code: 6,
        friendlyMsg: 'Você não tem permissão de acessar essas informações.',
        message: 'Usuário sem permissão de acesso, ' + req.user.type + ' tentando acessar funções de ' + allowed.toString()
      })
  }
}

module.exports.sameIdToken = (request, response, next) => {
  if (request.params.id === request.user.id || request.user.type === 'admin') {
    next()
  } else {
    next({
      status: 401,
      code: 2,
      friendlyMsg: 'ID incompatível com o usuário autenticado.',
      console: false
    })
  }
}
