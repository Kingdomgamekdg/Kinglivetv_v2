const { Timestamp } = require('bson')
const {Schema, Types,model} = require('mongoose')

const ListingAssetSchema = new Schema({
    contract: {type : String},
    collection_id : {type : String},
    id : {type : String},
    owner: {type : Types.ObjectId , ref : 'users'},
    asset  :  {type : Types.ObjectId , ref : 'assets'},
    quantity: {type : Number},
    type :{type : Number},// 1: SALE, 2: ACTIONS
    price: {type : Number},// in token payment
    payment_token:{type : String},
    time: {type : Date , default : Date.now},
    expiration: {type : Number},
    transaction: {type : String},
    bid_orders: [{type : Types.ObjectId , ref : 'buys'}],
    buys: [{type : Types.ObjectId , ref : 'buys'}]

})

module.exports = model('listing-assets', ListingAssetSchema)