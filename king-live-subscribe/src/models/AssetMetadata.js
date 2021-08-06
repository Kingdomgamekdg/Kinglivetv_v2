const {Schema, Types,model} = require('mongoose')

const AssetMetaDataSchema = new Schema({
    collection_id : {type : String},
    uri : {type : String},
    metadata : {type : JSON},
})

module.exports = model('asset-metadata', AssetMetaDataSchema)