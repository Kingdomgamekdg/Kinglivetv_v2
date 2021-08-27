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

    await this.create({
      from: _id,
      to: parent,
      type,
      value: amount
    })

    const amountReward = this.calculateReward(amount)

    await RewardQueue.addJob('INCREASE_REWARD', {
      userId: parent,
      point: amountReward
    })
  }

}

module.exports = new TransactionService(Model)