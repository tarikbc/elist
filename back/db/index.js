
const mongoose = require('mongoose')
const chalk = require('chalk')

const URI = process.env.MONGODB_URI

mongoose.connect(URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}).catch(error => {
  console.log('Erro na conexão do MongoDB: "' + error + '".')
})

mongoose.connection.on('connecting', function () {
  console.log('Tentando conectar no servidor MongoDB... ')
})

mongoose.connection.on('connected', function () {
  console.log('MongoDB ' + chalk.green('conectado.'))
})

mongoose.connection.on('disconnected', function () {
  console.log('Conexão MongoDB desconectada.')
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Conexão MongoDB desconectada por conta do desligamento do servidor.')
    process.exit(0)
  })
})

process.on('EHOSTUNREACH', function () {
  mongoose.connection.close(function () {
    console.log('Conexão MongoDB desconectada por conta do desligamento do servidor.')
    process.exit(0)
  })
})

process.on('EADDRNOTAVAIL', function () {
  mongoose.connection.close(function () {
    console.log('Conexão MongoDB desconectada por não conseguir conectar ao servidor.')
    process.exit(0)
  })
})

process.on('ETIMEDOUT', function () {
  mongoose.connection.close(function () {
    console.log('Conexão MongoDB desconectada por não conseguir conectar ao servidor.')
    process.exit(0)
  })
})

module.exports = {
  User: require('./entities/user'),
  Store: require('./entities/store'),
  Day: require('./entities/day')
}
