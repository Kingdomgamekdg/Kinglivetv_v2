const Joi = require('joi')
const Validation = require('../middlewares/validation')

const schema = {
  mimetype: Joi.string()
}

const actions = {
  getTotalAssets: []
}

module.exports = Validation(schema, actions)
