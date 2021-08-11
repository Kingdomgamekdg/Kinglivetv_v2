const Joi = require('joi')
const Validation = require('../middlewares/validation')
const joi = require('joi')

const schema = {
  limit: joi.number().required(),
  search: joi.string().trim(),
  prev: joi.string().trim(),
  ids: joi.string().trim()
}

const actions = {
  getListingAsset: []
}

module.exports = Validation(schema, actions)

