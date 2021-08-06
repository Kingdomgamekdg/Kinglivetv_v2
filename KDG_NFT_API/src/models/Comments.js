const mongoose = require('mongoose');
const {Schema, Types} = mongoose;


const CommentSchema = new Schema({
    user : {type : Types.ObjectId , ref : 'users'} , 
    comment : {type : String},
    video : {type : Types.ObjectId , ref : 'videos'},
    create_date : {type : Date , default : Date.now}
});
const Comments = mongoose.model('comments', CommentSchema);

