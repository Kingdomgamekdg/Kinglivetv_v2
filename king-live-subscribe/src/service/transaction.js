const BaseService = require('../cores/base-service')
const Model = require('../models/Transactions')
const RewardPercent = 5 // 5%

class TransactionService extends BaseService {
  calculateReward (amount) {
    return amount * (RewardPercent / 100)
  }

  async writeReward ({ amount, fromUser, type }) {
    const {
      _id,
      parent
    } = fromUser

    const amountReward = this.calculateReward(amount)

    return this.create({
      from: _id,
      to: parent,
      type,
      value: amountReward
    })
  }
}

module.exports = new TransactionService(Model)