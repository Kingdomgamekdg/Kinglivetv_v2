const { Timestamp } = require('bson')
const {Schema, Types,model} = require('mongoose')

const BuysSchema = new Schema({
    contract: {type : String},
    from: {type : Types.ObjectId , ref : 'users'},
    to: {type : Types.ObjectId , ref : 'users'},
    id:  {type : Number},
    list_id:  {type : Types.ObjectId , ref : 'listing-assets'},
    asset  :  {type : Types.ObjectId , ref : 'assets'},
    quantity: {type : Number},
    payment_amount: {type : Number},// in token payment
    payment_token:{type : String},
    time: {type : Number},
    status: {type : Number },//1 done
})

module.exports = model('buys', BuysSchema)