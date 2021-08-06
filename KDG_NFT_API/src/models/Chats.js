const {Schema, Types,model} = require('mongoose')

const chatSchema = new Schema({
    user : {type : Types.ObjectId , ref : 'users'},
    stream : {type : Types.ObjectId , ref : 'streams'},
    chat : {type : String},
})

module.exports = model('chats', chatSchema)