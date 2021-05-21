const mongoose = require('mongoose')
const timestamps = require('motime')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const mongoosePaginate = require('mongoose-paginate-v2')
const ObjectId = mongoose.Schema.Types.ObjectId

const properties = {
  name: {
    type: String,
    required: true
  },
  users: [
    {
      type: ObjectId,
      ref: 'User'
    }
  ],
  city: String,
  cnpj: String,
}
const options = {
  collection: 'stores',
  id: true,
  versionKey: false,
  timestamps: false
}

const storeSchema = new Schema(properties, options)

storeSchema.plugin(timestamps)
storeSchema.plugin(mongoosePaginate)

const Store = mongoose.model('Store', storeSchema)
module.exports = Store
