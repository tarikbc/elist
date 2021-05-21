const { Day } = require('../../../db')
const { types } = require('../../constants')
const { isValidObjectId } = require('mongoose')

module.exports.userIsInDay = (req, res, next) => {
  // Verifica se o dayId é válido
  // Verifica se usuário existe
  // Verifica se o dia existe
  // Verifica se o usuário contém a loja do dia

  if (!isValidObjectId(req.params.dayId)) {
    return next({
      status: 400,
      code: 2,
      friendlyMsg: 'ID do dia inválido.',
      console: true,
      suspect: true
    })
  }

  if (!req.user) {
    return next({
      status: 400,
      code: 2,
      friendlyMsg: 'O usuário informado não existe.',
      console: true,
      suspect: true
    })
  }
  Day.find({ _id: req.params.dayId }, { storeId: true }).limit(1).lean().then(day => {
    if (day.length === 0) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Dia não encontrado.',
        console: false
      })
    }

    if (req.user.type === 'admin') return next()

    const userStoreIndex = req.user.stores.findIndex(store => String(store.storeId) === String(day[0].storeId))
    if (userStoreIndex < 0) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'O usuário informado não está vinculado à loja desse dia.',
        console: true,
        suspect: true
      })
    } else {
      if (!types.head.includes(req.user.stores[userStoreIndex].type)) {
        return next({
          status: 401,
          code: 2,
          friendlyMsg: 'Você não tem permissão para visualizar esse dia.',
          console: true,
          suspect: true
        })
      } else {
        next()
      }
    }
  }).catch(err => next(err))
}
