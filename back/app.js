const express = require('express')
const bearerToken = require('express-bearer-token')
const routes = require('./routes/index')
const chalk = require('chalk')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(bearerToken())
app.use(express.json())
app.use(routes)
console.log(`Rotas ${chalk.green('carregadas')}.`)
app.use((err, request, response, next) => {
  if(err){
    console.log(err)
    response.status(err.status || 400).json({
      error: process.env.NODE_ENV === 'production' ? err.validation ? {
        friendlyMsg: err.friendlyMsg,
        code: err.code,
        validation: err.validation,
        data: err.data
      } : {
        friendlyMsg: err.friendlyMsg,
        code: err.code,
        data: err.data
      } : err
    })
  }else{
    next()
  }

})

module.exports = app
