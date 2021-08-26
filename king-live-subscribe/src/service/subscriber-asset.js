/* eslint-disable camelcase */
'use strict'

const util = require('util')
const request = require('request')
const config = require('./../config')
const axios = require('./axios')

const database = require('./../lib/database')
const ObjectId = require('mongoose').Types.ObjectId
const { Decimal } = require('decimal.js')

const requestPromise = util.promisify(request)
const { model, isValidObjectId } = require('mongoose')
const Assets = model('assets')
const AssetMetaData = model('asset-metadata')
const UserAsset = model('user-assets')
const Users = model('users')
const ListingAssets = model('listing-assets')
const Activities = model('activities')
const BidOrders = model('bid-orders')
const Buys = model('buys')

const TransactionService = require('./transaction')

class SubcripberAsset {

  /**
   * Initializes default settings
   */
  constructor () {
    this._handling = false
  }

  async start () {

    console.log('Started metadata service')

    const db = database.getInstance()
    // console.log("db",db);
    db.on('notification', async (data) => {
      console.log('data.payload', data)
      const payload = JSON.parse(data.payload)
      console.log('payload', payload)
      try {
        await axios.get('update_dashboard')
      } catch (ex) {

      }
      const metadata = await AssetMetaData.findOne({ uri: payload.uri })
      if (data.channel === 'new_asset') {
        let user = await Users.findOne({
          address: {
            '$regex': '^' + payload.creator + '\\b', '$options': 'i'
          }
        })
        if (!user) {
          user = await Users.create({ address: payload.creator })
        }
        let status = 0
        if (payload.is_reviewed === 'true') {
          status = 1
        }

        const asset = await Assets.create({
          collection_id: payload.collection_id,
          id: payload.asset_id,
          metadata: metadata.metadata,
          owner: user?._id,
          editions: payload.editions,
          total_editions: payload.total_editions,
          status: status,
          time: new Date(new Number(payload.time) * 1000),
        })
        await UserAsset.updateOne({
          asset: new ObjectId(asset?._id),
          user: new ObjectId(user?._id)
        }, { asset: asset?._id, user: user?._id, amount: new Number(payload.editions) }, { upsert: true, new: true })
      } else if (data.channel === 'new_review') {
        const asset = await Assets.findOne({
          collection_id: payload.collection_id,
          id: payload.asset_id,
        })
        if (payload.result === 'true') {
          asset.status = 1
        } else {
          asset.status = 2
        }
        await asset.save()
      } else if (data.channel === 'new_transfer') {
        const asset = await Assets.findOne({ collection_id: payload.collection_id, id: payload.asset_id })
        let fromUser
        let toUser
        if (payload.from != config.MARKET_CONTRACT && (payload.from != config.ADDRESS_0)) {
          fromUser = await Users.findOne({ address: payload.from })
          if (!fromUser) {
            fromUser = await Users.create({ address: payload.from })
          }
          const fromBalance = await UserAsset.findOne({ asset: ObjectId(asset?._id), user: ObjectId(fromUser?._id) })
          await UserAsset.updateOne({ _id: ObjectId(fromBalance._id) }, {
            asset: ObjectId(asset?._id),
            user: ObjectId(fromUser?._id),
            amount: new Number(fromBalance?.amount ? fromBalance.amount : 0) - new Number(payload?.amount)
          }, { upsert: true, new: true })
        }
        if ((payload.to != config.MARKET_CONTRACT) && (payload.to != config.ADDRESS_0)) {
          toUser = await Users.findOne({ address: payload.to })
          if (!toUser) {
            toUser = await Users.create({ address: payload.to })
          }
          const toBalance = await UserAsset.findOne({ asset: ObjectId(asset?._id), user: ObjectId(toUser?._id) })
          await UserAsset.updateOne({
            asset: ObjectId(asset?._id),
            user: ObjectId(toUser?._id)
          }, {
            asset: ObjectId(asset?._id),
            user: ObjectId(toUser?._id),
            amount: new Number(toBalance?.amount ? toBalance.amount : 0) + new Number(payload.amount)
          }, { upsert: true, new: true })
        }
        if (fromUser && toUser) {
          await Activities.create({
            collection_id: payload.collection_id,
            contract: payload.collection,
            from_user: new ObjectId(fromUser?._id),
            to_user: new ObjectId(toUser?._id),
            type: 3, //1:create, 2:mint ,3 :donate, 4 : list, 5: bid, 6: buy, 7 accept Bid,
            data: { from: payload.from, to: payload.to, amount: payload.amount },
            asset: new ObjectId(asset?._id),
            time: Date.now(),
            transaction: payload.transaction,
          })
        }
      } else if (data.channel === 'new_list') {
        let owner = await Users.findOne({ address: payload.owner })
        if (!owner) {
          owner = await Users.create({ address: payload.owner })
        }
        const asset = await Assets.findOne({ collection_id: payload.collection_id, id: payload.asset_id })
        await ListingAssets.create({
          contract: payload.contract,
          collection_id: payload.collection_id,
          id: payload.list_id,
          owner: new ObjectId(owner?._id),
          asset: new ObjectId(asset?._id),
          quantity: payload.quantity,
          type: payload.mask,// 1: SALE, 2: ACTIONS
          price: payload.price,// in token payment
          payment_token: payload.payment_token,
          time: new Date(new Number(payload.time) * 1000).toISOString(),
          expiration: payload.expiration,
          transaction: payload.transaction,
        })

        await Activities.create({
          collection_id: payload.collection_id,
          contract: payload.contract,
          from_user: new ObjectId(owner?._id),
          type: 4, //1:create, 2:mint ,3 :transfer, 4 : list, 5: bid, 6: buy, 7 accept Bid,
          data: {
            quantity: payload.quantity,
            type: payload.mask,
            owner: owner?.address,
            price: payload.price,
            payment_token: payload.payment_token
          },
          asset: new ObjectId(asset?._id),
          time: new Date(new Number(payload.time) * 1000).toISOString(),
          transaction: payload.transaction,
        })
      } else if (data.channel === 'new_buy') {
        await this.handleNewBuy(payload)
      } else if (data.channel === 'new_bid') {
        const from = await Users.findOne({ address: payload.from })
        const currentList = await ListingAssets.findOne({
          contract: payload.contract,
          id: payload.list_id
        }).populate('assets').populate('bid-orders')
        const payment_amount = new Decimal(payload.quantity).mul(payload.bid_price).toNumber()
        const bidOrder = await Buys.create({
          contract: payload.contract,
          list_id: ObjectId(currentList?._id),
          id: payload.bid_order_id,
          type: 2,
          from: ObjectId(from?.id),
          to: ObjectId(currentList.owner),
          asset: ObjectId(currentList?.asset?._id),
          quantity: payload.quantity,
          payment_price: new Number(payload.bid_price),// in token payment
          payment_token: payload.bid_token,
          payment_amount: payment_amount,
          expiration: payload.expiration,
          time: new Date(new Number(payload.time) * 1000).toISOString(),
          status: 0,//0 order, 1 accept, 2 cancel
        })
        currentList.bid_orders.push(bidOrder)
        await currentList.save()
      } else if (data.channel === 'new_accept_bid') {
        await this.handleNewAcceptBid(payload)
      } else if (data.channel === 'new_cancel_bid') {
        const bidOrder = await Buys.findOne({ contract: payload.contract, id: Number(payload.bid_order_id) })
        bidOrder.status = 2
        await bidOrder.save()
      } else if (data.channel === 'new_update_bid') {
        const bidOrder = await Buys.findOne({ contract: payload.contract, id: payload.bid_order_id })
        bidOrder.contract = payload.contract,
          bidOrder.list_id = ObjectId(currentList?._id),
          bidOrder.from = ObjectId(from?.id) ,
          bidOrder.asset = ObjectId(currentList?.asset?._id),
          bidOrder.quantity = payload.quantity,
          bidOrder.payment_price = new Number(payload.bid_price),// in token payment
          bidOrder.payment_toke = payload.bid_token,
          bidOrder.expiration = payload.expiration,
          bidOrder.time = new Date(new Number(payload.time) * 1000).toISOString()
        bidOrder.status = 1,//1 order, 2 accept, 3 cancel
          await bidOrder.save()
      } else if (data.channel === 'new_cancel_list') {
        const currentList = await ListingAssets.findOne({
          id: payload.list_id,
          contract: payload.contract
        }).populate('assets users')
        currentList.quantity = 0
        await currentList.save()
      }
    })

    db.query('LISTEN new_asset')
    db.query('LISTEN new_transfer')
    db.query('LISTEN new_list')
    db.query('LISTEN new_cancel_list')
    db.query('LISTEN new_buy')
    db.query('LISTEN new_bid')
    db.query('LISTEN new_accept_bid')
    db.query('LISTEN new_cancel_bid')
    db.query('LISTEN new_update_bid')
    db.query('LISTEN new_review')

  }

  async handleNewAcceptBid (payload) {
    try {
      const bidOrder = await Buys.findOne({ contract: payload.contract, id: Number(payload.bid_order_id) })
      const currentList = await ListingAssets.findOne({ _id: ObjectId(bidOrder.list_id) })
      const fromUser = await Users.findById(currentList.owner)
      const toUser = await Users.findById(bidOrder.from)
      console.log('bidOrder', bidOrder)
      console.log('currentList', currentList)

      bidOrder.status = 1
      await bidOrder.save()
      currentList.quantity = Number(currentList.quantity) - Number(bidOrder.quantity)
      await currentList.save()

      await Activities.create({
        collection_id: currentList.collection_id,
        contract: currentList.contract,
        from_user: new ObjectId(fromUser?._id),
        to_user: new ObjectId(toUser?._id),
        type: 7, //1:create, 2:mint ,3 :transfer, 4 : list, 5: bid, 6: buy, 7 accept Bid,
        data: {
          from: new ObjectId(fromUser?._id),
          listing: new ObjectId(currentList?._id),
          quantity: bidOrder.quantity,
          payment_token: bidOrder.payment_token,
          payment_amount: bidOrder.payment_amount
        },
        asset: ObjectId(currentList?.asset),
        time: Date.now(),
        transaction: payload.transaction,
      })

      await TransactionService.writeReward({ amount: bidOrder.payment_amount, fromUser, type: 4 })
    } catch (e) {
      console.error(e)
    }
  }

  async handleNewBuy (payload) {
    try {
      let fromUser = await Users.findOne({ address: payload.from })
      if (!fromUser) {
        fromUser = await Users.create({ address: payload.from })
      }
      let toUser = await Users.findOne({ address: payload.to })
      if (!toUser) {
        toUser = await Users.create({ address: payload.to })
      }
      const currentList = await ListingAssets.findOne({
        contract: payload.contract,
        id: payload.list_id
      }).populate('assets').populate('buys')
      console.log('currentList', currentList)
      const buy = await Buys.create({
        contract: payload.contract,
        list_id: ObjectId(currentList?._id),
        from: ObjectId(fromUser?._id),
        to: ObjectId(toUser?._id),
        type: 1,
        asset: ObjectId(currentList?.asset?._id),
        quantity: payload.quantity,
        payment_price: Number(currentList.price),// in token payment
        payment_amount: Number(payload.payment_amount),// in token payment
        payment_token: payload.payment_token,
        time: new Date(Number(payload.time) * 1000).toISOString(),
        status: 1,//0 order, 1 accept, 2 cancel
      })
      currentList.buys.push(buy)
      currentList.quantity = Number(currentList.quantity) - Number(payload.quantity)
      await currentList.save()
      await Activities.create({
        collection_id: currentList.collection_id,
        contract: payload.contract,
        from_user: new ObjectId(fromUser?._id),
        to_user: new ObjectId(toUser?._id),
        type: 6, //1:create, 2:mint ,3 :transfer, 4 : list, 5: bid, 6: buy, 7 accept Bid,
        data: {
          from: new ObjectId(fromUser?._id),
          listing: new ObjectId(currentList?._id),
          quantity: payload.quantity,
          payment_price: currentList.price,
          payment_token: payload.payment_token,
          payment_amount: payload.payment_amount
        },
        asset: ObjectId(currentList?.asset?._id),
        time: new Date(Number(payload.time) * 1000).toISOString(),
        transaction: payload.transaction,
      })

      await TransactionService.writeReward({ amount: payload.payment_amount, fromUser, type: 4 })
    } catch (e) {
      console.error(e)
    }
  }
}

module.exports = new SubcripberAsset()
