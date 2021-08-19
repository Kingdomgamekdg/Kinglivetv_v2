const { Timestamp } = require('bson')
const {Schema, Types,model} = require('mongoose')

const ActivitiesSchema = new Schema({
    collection_id : {type : String},
    contract: {type : String },
    from_user: {type : Types.ObjectId , ref : 'users'},
    to_user  :  {type : Types.ObjectId , ref : 'users'},
    type : {type : Number}, //1:create, 2:mint ,3 :transfer, 4 : list, 5: bid, 6: buy, 7 accept Bid, 
    data: {type : JSON},
    asset: {type : Types.ObjectId , ref : 'assets'},
    time : {type : Date , default : Date.now},
    transaction:{type : String},
})

module.exports = model('activities', ActivitiesSchema)