const {Schema, Types,model} = require('mongoose')

const UserAssetSchema = new Schema({
    user : {type : Types.ObjectId , ref : 'users'},
    asset : {type : Types.ObjectId , ref : 'assets'},
    amount : {type : Number},
})

module.exports = model('user-assets', UserAssetSchema)