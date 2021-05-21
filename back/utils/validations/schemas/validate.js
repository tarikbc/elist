const Joi = require('joi')
const { errorList } = require('../../constants')

const getError = (error) => {
  if (error.details.length > 0) {
    const path = `${error.details[0].path[0]}.${error.details[0].path[error.details[0].path.length - 1]}.${error.details[0].type}`
    return Object.prototype.hasOwnProperty.call(errorList, path) ? {
      message: errorList[path][0],
      suspect: errorList[path][1]
    } : {
      message: path,
      suspect: false
    }
  }
}

module.exports.mongoId = Joi.string().custom((oid, helper) => oid.length === 24 && !isNaN(Number('0x' + oid)) ? oid : helper.error('any.invalid'))

module.exports.yup = (schema, req, next, status = 400) => {
  schema.validate(req.body)
    .then(() => next())
    .catch((err) =>
      next({
        status,
        code: 2,
        friendlyMsg: err.errors[0],
        console: false
      })
    )
}

module.exports.joi = (schema, req, next, status = 400, param = 'body') => {
  schema.validateAsync(req[param])
    .then(() => next())
    .catch(err => {
      const errObj = getError(err)
      next({
        status,
        code: 2,
        friendlyMsg: errObj.message,
        suspect: errObj.suspect,
        console: false
      })
    })
}
