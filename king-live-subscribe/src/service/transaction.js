const BaseService = require('../cores/base-service')
const Model = require('../models/Transactions')
const RewardPercent = 5 // 5%

const RewardQueue = global.Queue.createQueue('Reward')

class TransactionService extends BaseService {
  calculateReward (amount) {
    return amount * (RewardPercent / 100)
  }

  async writeReward ({ amount, fromUser, type }) {
    const {
      _id,
      parent
    } = fromUser

    const point = this.calculateReward(amount)

    await this.create({
      from: _id,
      to: parent,
      type,
      value: amount,
      point
    })

    await RewardQueue.addJob('INCREASE_REWARD', {
      userId: parent,
      point
    })
  }

}

module.exports = new TransactionService(Model)