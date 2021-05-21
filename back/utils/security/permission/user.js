const mongoose = require('mongoose')
const { User, Store } = require('../../../db')
const { types } = require('../../constants')

module.exports.create = (req, res, next) => {
  const { email, cpf } = req.body
  const query = {}
  if (email) {
    query.email = email
  } else {
    if (cpf) {
      query.cpf = cpf
    } else {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Não foi informado email nem cpf.',
        console: false
      })
    }
  }
  if (Object.entries(query).length > 0) {
    User.find(query, { _id: 1 }).limit(1).lean().then(user => {
      if (user.length > 0) {
        return next({
          status: 400,
          code: 2,
          friendlyMsg: 'Já existe um usuário com esses dados de acesso.',
          console: false
        })
      }
    }).catch(err => next(err))
  }

  if (!req.user.type === 'admin') {
    const findStore = req.user.stores.find(store => String(store.storeId) === String(req.body.storeId))
    if (!findStore || !types.head.includes(findStore.type)) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Você não tem permissão para criar um usuário.',
        console: true,
        suspect: true
      })
    }
  }
  next()
}

module.exports.edit = (req, res, next) => {
  User.find({ _id: req.params.id }, { _id: 1, email: 1, cpf: 1 }).limit(1).lean().then(user => {
    const { email, cpf } = req.body
    if (user.length === 0) {
      return next({
        status: 400,
        code: 2,
        friendlyMsg: 'Usuário não encontrado.',
        console: false
      })
    }

    const query = []
    if ((email && email.length >= 0 && email !== String(user[0].email))) query.push({ email })
    if ((cpf && cpf.length >= 0 && cpf !== String(user[0].cpf))) query.push({ cpf })
    if (query.length > 0) {
      User.find({ $or: query }, { _id: 1 }).limit(1).lean().then(userExists => {
        if (userExists.length > 0) {
          return next({
            status: 400,
            code: 2,
            friendlyMsg: 'Já existe um usuário com esses dados de acesso.',
            console: false
          })
        }
      }).catch(err => next(err))
    }

    if (req.user.type === 'admin') return next()

    if (String(req.user.id) !== String(req.params.id)) {
      // Monta um array com os IDS das lojas do usuario logado
      // Criar uma lista em que o usuario autentifcado é owner ou manager
      const stores = req.user.stores.filter(s => types.head.includes(s.type)).map(s => mongoose.Types.ObjectId(s.storeId._id))
      if (stores.length === 0) {
        return next({
          status: 400,
          code: 2,
          friendlyMsg: 'Você não tem permissão para editar outro usuário.',
          console: true,
          suspect: true
        })
      }

      // Busca no BD o as lojas do usuario logado
      Store.find({ _id: { $in: stores } }, { _id: 1, users: 1 }).lean().then(stores => {
        // Se não encontrar alguma loja returna um erro
        if (stores.length === 0) {
          return next({
            status: 400,
            code: 2,
            friendlyMsg: 'Loja não encontrada',
            console: false
          })
        }

        const userInStore = stores.flatMap(store => store.users).find(u => String(u) === String(req.params.id))

        if (!userInStore) {
          return next({
            status: 400,
            code: 2,
            friendlyMsg: 'O usuário não pertence a sua loja.',
            console: true,
            suspect: true
          })
        }
      }).catch(err => next(err))
    }
    next()
  }).catch(err => next(err))
}

module.exports.exists = (req, res, next) => {
  User.find({ _id: req.params.id }).limit(1).lean().then(user => {
    if (user.length === 0) {
      return next({
        status: 401,
        code: 2,
        friendlyMsg: 'Usuário não encontrado.',
        console: false
      })
    }

    if (req.user.type === 'admin') return next()

    const findStore = req.user.stores.find(store => String(store.storeId) === String(req.body.storeId))
    if (!findStore || !types.head.includes(findStore && findStore.type)) {
      return next({
        status: 401,
        code: 2,
        friendlyMsg: 'Você não tem permissão sobre esse usuário.',
        console: true,
        suspect: true
      })
    }
    next()
  }).catch(err => next(err))
}
