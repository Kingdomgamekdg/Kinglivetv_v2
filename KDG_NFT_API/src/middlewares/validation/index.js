const Joi = require('joi')

module.exports = (schema, actions) => {

  return (action) => {
    return async (req, res, next) => {
      let data
      if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
        data = req.body
      } else if (req.method === 'GET') {
        data = req.query
      }

      let nSchema = {}

      if (action) {
        const fields = actions[action]
        if (fields.length) {
          for (const f of fields) {
            nSchema[f] = schema[f]
          }
        } else {
          nSchema = schema
        }
      }

      nSchema = Joi.object(nSchema)

      try {
        await nSchema.validateAsync(data)
        next()
      } catch (err) {
        const { details } = err
        const message = details.map(i => i.message).join(',')
        res.status(422).json({ error: message })
      }
    }
  }
}