const express = require('express')
const router = express.Router()
const chalk = require('chalk')
const security = require('../utils/security')

router.get('/', (request, response) => {
  response.sendFile('./views/index.html')
})

router.use('/v1/user', security.auth(false), require('./user'))
router.use('/v1/auth', require('./auth'))
router.use('/v1/store', require('./store'))
router.use('/v1/day', security.auth(false), require('./day'))

router.get(/^\/_ah\/st(art|op)$/, async (request, response, next) => {
  const isStart = request.originalUrl.split('/')[2] === 'start'
 
  if (request.ip === '0.1.0.3') {
    if (isStart) {
      console.log(`Servidor ${chalk.green('acordado')}.`)
    } else {
      await graceful()
      console.log(`Servidor ${chalk.yellow('dormindo')}.`)
    }
    response.json({ ok: true })
  } else {
    next({
      status: 500,
      code: 3,
      friendlyMsg: 'Você não tem permissão de acessar essa rota.',
      message: 'Alguém tentou acessar a rota da google.',
      console: true,
      suspect: true
    })
  }
})

router.use((request, response, next) => {
  next({
    status: 404,
    code: 3,
    friendlyMsg: 'Rota não encontrada.'
  })
})

module.exports = router
