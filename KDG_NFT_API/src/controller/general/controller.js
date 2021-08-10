const common = require('../../lib/common')
const joi = require('joi')
const { model, isValidObjectId } = require('mongoose')
const BidOrders = model('bid-orders')
const Buys = model('buys')

module.exports = class {
  static async getTotalTraders (_req, _res) {
    try {

      const totalBidOrders = await BidOrders.countDocuments({
        status: 2
      })

      const totalBuys = await Buys.countDocuments({
        status: 1
      })

      const total = totalBidOrders + totalBuys

      _res.status(200).json({
        total
      })
    } catch (e) {
      _res.status(400).json(e.message)
    }
  }
}