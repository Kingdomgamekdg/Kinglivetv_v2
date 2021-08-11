const { Schema, Types, model } = require('mongoose')

const AssetSchema = new Schema({
    collection_id: { type: String },
    id: { type: String },
    metadata: { type: JSON },
    owner: { type: Types.ObjectId, ref: 'users' },
    editions: { type: Number },
    total_editions: { type: Number }
})

module.exports = model('assets', AssetSchema)
