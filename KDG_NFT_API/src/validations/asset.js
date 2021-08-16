const Joi = require('joi')
const Validation = require('../middlewares/validation')

const schema = {
  mimetype: Joi.string(),
  id: Joi.string()
}

const actions = {
  getTotalAssets: [],
  getAsset: []
}

module.exports = Validation(schema, actions)
