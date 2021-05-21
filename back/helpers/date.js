var { DateTime } = require('luxon')

const getISOfromDateObj = (DateObj) => {
  return DateObj.toISO()
}
const getDateObjFromISO = (dateIsoString) => {
  return DateTime.fromISO(dateIsoString).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
}

const getDateObjFromJsDate = (dateIsoString) => {
  return DateTime.fromJSDate(dateIsoString).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
}

const getLocaleStringFromISO = (dateIsoString) => {
  return DateTime.fromISO(dateIsoString).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toLocaleString({ locale: 'pt-br' })
}

const getDateObjByDay = (thisMonth, day) => {
  return thisMonth.toUTC(0).set({ day: day, hour: 15, minute: 0, second: 0, millisecond: 0 })
}

const getToday = () => {
  return DateTime.utc().set({ hour: 15, minute: 0, second: 0, millisecond: 0 })
}

const getNowLocal = () => {
  return DateTime.local()
}

const getThisMonth = () => {
  return DateTime.utc().set({ day: 1, hour: 15, minute: 0, second: 0, millisecond: 0 })
}

const getSQLfromDateObj = (DateObj) => {
  return DateObj.toSQLDate()
}

const getSQLfromJsDate = (dateIsoString) => {
  return DateTime.fromJSDate(dateIsoString).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toSQLDate()
}

const getISOFromJsDate = (dateIsoString) => {
  return DateTime.fromJSDate(dateIsoString).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toISO()
}

const getFormatFromDateObj = (dateObj, format) => {
  return dateObj.toFormat(format)
}

const getISOFromFormat = (string, format) => {
  return DateTime.fromFormat(string, format).toUTC(0).set({ hour: 15, minute: 0, second: 0, millisecond: 0 }).toISO()
}

const date = {
  getISOfromDateObj,
  getDateObjFromISO,
  getDateObjFromJsDate,
  getLocaleStringFromISO,
  getDateObjByDay,
  getToday,
  getNowLocal,
  getThisMonth,
  getSQLfromDateObj,
  getSQLfromJsDate,
  getISOFromJsDate,
  getFormatFromDateObj,
  getISOFromFormat
}

module.exports = date
