const {Schema, Types,model} = require('mongoose')

const AssetSchema = new Schema({
    collection_id : {type : String},
    id : {type : String},
    metadata : {type : JSON},
    owner  :  {type : Types.ObjectId , ref : 'users'},
    editions : {type : Number},
    total_editions : {type : Number},
    status : {type : Number}, // 0 : pending , 1 : reviewd , 3 : reject
    time: {type : Number},
})

module.exports = model('assets', AssetSchema)