'use strict'

/**
 * Check if is object type
 * @param item
 * @returns {boolean}
 * @constructor
 */
const IsObject = item => {
  return Object.prototype.toString.call(item) === '[object Object]'
}
module.exports.IsObject = IsObject

/**
 * Check if is empty
 * @param item
 * @returns {boolean}
 * @constructor
 */
module.exports.IsEmpty = item => {
  return (Array.isArray(item) && item.length === 0) || (IsObject(item) && Object.keys(item).length === 0) || !item
}

/**
 * Waiting handler
 * @param second
 * @returns {Promise<unknown>}
 * @constructor
 */
module.exports.Waiting = second => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true)
    }, second * 1000)
  })
}

/**
 * Get timestamp from now/date
 * @param date
 * @returns {number}
 * @constructor
 */
module.exports.GetTimestamp = (date = null) => {
  if (date) {
    if (Object.prototype.toString.call(date) === '[object Date]') {
      return Math.ceil(date.getTime() / 1000)
    } else if (typeof date === 'string') {
      return Math.ceil(Date.parse(date) / 1000)
    }
  }

  return Math.ceil(Date.now() / 1000)
}

module.exports.ReplaceDotAndUnderscore = (object) => {
  Object.keys(object).forEach(k => {
    if (k.includes('.')) {
      const newKey = k.replace(/\./g, '__')
      object[newKey] = object[k]
      delete object[k]
    }
  })
  return object
}

module.exports.SwitchDotAndUnderscore = (object) => {
  Object.keys(object).forEach(k => {
    if (k.includes('.') || k.includes('__')) {
      const newKey = k.includes('.') ? k.replace(/\./g, '__') : k.replace(/_/g, '.')
      object[newKey] = object[k]
      delete object[k]
    }
  })
  return object
}

module.exports.FormatDate = (date) => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return [day, month, year].join('_')
}
