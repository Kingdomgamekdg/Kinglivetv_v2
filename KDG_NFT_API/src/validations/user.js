const Validation = require('../middlewares/validation')
const Joi = require('joi')

const schema = {
  address: Joi.string().trim().required(),
  isLock: Joi.boolean(),
  isReviewer: Joi.boolean(),
  kycStatus: Joi.number()
}

const actions = {
  login: ['address'],
  getTotalUsers: ['isLock', 'isReviewer', 'kycStatus']
}

module.exports = Validation(schema, actions)

