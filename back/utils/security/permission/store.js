const { Store } = require('../../../db')
const { isValidObjectId } = require('mongoose')
const { types } = require('../../constants')

module.exports.userIsLinked = (name = 'storeId', typesAllowed = types.topLevel) => (req, res, next) => {
  // Verifica se a loja existe
  // Verifica se o usuário quesolicitiou tem permissão para acessar
  // Verifica se o id é válido

  const storeId = req.params[name]

  if (!isValidObjectId(storeId)) {
    return next({
      status: 400,
      code: 2,
      friendlyMsg: 'ID da loja inválida.',
      console: true,
      suspect: true
    })
  }

  Store.find({ _id: storeId }, { _id: true }).limit(1).lean().then(store => {
    if (store.length === 0) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Loja não existe.',
        console: false
      })
    }

    if (req.user.type === 'admin') return next()

    // Como já rolou um find desse user que está populado em req.user, podemos reaproveitar
    const findStore = req.user.stores.find(store => String(store.storeId) === storeId)
    if (!findStore || !typesAllowed.includes(findStore && findStore.type)) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Você não tem permissão para acessar os dados dessa loja.',
        console: true,
        suspect: true
      })
    }
    next()
  }).catch(err => next(err))
}

module.exports.types = types
