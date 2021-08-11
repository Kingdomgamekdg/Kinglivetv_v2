'use strict'

const { model } = require('mongoose')
const Streams = model('streams')

module.exports = class {
  static async getTotalStreamTime (_req, _res) {
    try {
      const streams = await Streams.aggregate([
        {
          $match: {
            status: 2,
            end_date: {
              $exists: true
            }
          }
        },
        {
          $project: {
            _id: 1,
            start_date: 1,
end_date: 1,
            streamTime: { $subtract: ['$end_date', '$start_date'] }
          }
        },
        {
          $group:
            {
              _id: null,
              total: { $sum: '$streamTime' }
            }
        }
      ])

      let total = 0
      if (streams.length) {
        total = streams[0].total
      }

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}
