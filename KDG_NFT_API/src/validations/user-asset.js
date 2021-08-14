const Validation = require('../middlewares/validation')
const Joi = require('joi')

const schema = {
  limit: Joi.number(),
  ids: Joi.string().trim(),
  status: Joi.number(),
  mimetype: Joi.string(),
  search: Joi.string().trim(),
  prev: Joi.string().trim()
}

const actions = {
  getAssets: []
}

module.exports = Validation(schema, actions)
