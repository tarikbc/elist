const mongoose = require('mongoose')
const timestamps = require('motime')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
const mongoosePaginate = require('mongoose-paginate-v2')

const ObjectId = mongoose.Schema.Types.ObjectId

const properties = {
  date: Date,
  storeId: {
    type: ObjectId,
    ref: 'Store'
  },
  lastSync: Date,
  activities: [{
    sellerId: {
      type: ObjectId,
      ref: 'User'
    },
    type: {
      type: String,
      enum: [
        'start',
        'end',
        'end_operational',
        'end_food',
        'end_coffee',
        'end_bathroom',
        'end_external'
      ],
      default: 'start'
    },
    date: Date
  }],
  events: [{
    entryType: {
      type: String,
      enum: [
        'normal',
        'out_client',
        'out_operational',
        'out_return'
      ],
      default: 'normal'
    },
    success: {
      type: Boolean,
      default: true
    },
    period: {
      start: Date,
      end: Date
    },
    sellerId: {
      type: ObjectId,
      ref: 'User'
    },
    selected: {
      title: String,
      options: Array
    }
  }]
}
const options = {
  collection: 'days',
  id: true,
  versionKey: false,
  timestamps: false
}

const daySchema = new Schema(properties, options)

daySchema.plugin(timestamps)
daySchema.plugin(mongoosePaginate)

const Day = mongoose.model('Day', daySchema)
module.exports = Day
