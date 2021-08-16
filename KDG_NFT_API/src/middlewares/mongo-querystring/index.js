'use strict'

const MongoQS = require('mongo-querystring')

const QueryString = new MongoQS({
  // blacklist: {
  //   page: 1,
  //   offset: 1,
  //   skip: 1,
  //   limit: 1,
  //   sort: 1,
  //   fields: 1
  // },
  string: {
    toNumber: false,
    toBoolean: true
  }
})

module.exports = (req, res, next) => {
  let limit = 10
  if (req.query.limit) {
    limit = Number(req.query.limit)
    delete req.query.limit
  }
  req.paging = {
    limit
  }
  req.query = QueryString.parse(req.query)

  next()
}
