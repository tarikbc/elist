const mongoose = require('mongoose')
const timestamps = require('motime')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const mongoosePaginate = require('mongoose-paginate-v2')
const ObjectId = mongoose.Schema.Types.ObjectId
const { types } = require('../../utils/constants')

const properties = {
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    },
    complete: {
      type: String,
      required: true
    }
  },
  email: {
    type: String
  },
  cpf: {
    type: String
  },
  type: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  phone: {
    type: String
  },
  password: {
    type: String,
    bcrypt: true
  },
  stores: [{
    storeId: {
      type: ObjectId,
      ref: 'Store'
    },
    joinedAt: {
      type: Date
    },
    type: {
      type: String,
      enum: types.everyone
    }
  }]
}
const options = {
  collection: 'users',
  id: true,
  versionKey: false,
  timestamps: false
}

const userSchema = new Schema(properties, options)

userSchema.plugin(timestamps)
userSchema.plugin(mongoosePaginate)

const User = mongoose.model('User', userSchema)
module.exports = User
