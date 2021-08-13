const Joi = require('joi')
const Validation = require('../middlewares/validation')

const schema = {
  limit: Joi.number().required(),
  search: Joi.string().trim(),
  prev: Joi.string().trim(),
  ids: Joi.string().trim()
}

const actions = {
  getListingAsset: []
}

module.exports = Validation(schema, actions)
