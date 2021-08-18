const { Timestamp } = require('bson')
const {Schema, Types,model} = require('mongoose')

const BuysSchema = new Schema({
    contract: {type : String},
    from: {type : Types.ObjectId , ref : 'users'},
    to: {type : Types.ObjectId , ref : 'users'},
    type: {type : Number}, //1 buys , 2// bid
    id:  {type : Number},
    list_id:  {type : Types.ObjectId , ref : 'listing-assets'},
    asset  :  {type : Types.ObjectId , ref : 'assets'},
    quantity: {type : Number},
    payment_price: {type : Number},// in token payment
    payment_amount: {type : Number},// in token payment
    payment_token:{type : String},
    time: {type : Date , default : Date.now},
    status: {type : Number },//1 done
})

module.exports = model('buys', BuysSchema)