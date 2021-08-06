const mongoose = require('mongoose');
const {Schema, Types} = mongoose;


const userSchema = new Schema({
    address :{type : String , required : true , unique : true},
    email: {type : String , required : false , unique : false},
    password: {type : String },
    ref_code: {type : String},
    parent: { type: Types.ObjectId, ref: 'users' },
    is2FA: {type : Boolean , default : false},
    create_date: {type : Date , default : () => new Date()},
    last_login: {type : Date , default : () => new Date()},
    isLock: {type : Boolean , default : false},
    isReviewer: {type : Boolean , default : false},
    kyc : {
        status : {type : Number, default : 0},
        id : {type : String, default : ''},
        first_name : {type : String, default : ''},
        last_name : {type : String, default : ''},
        phone : {type : String, default : ''},
        birth_day : {type : String, default : ''},
        address : {type : String, default : ''},
        country: {type : String , default : ''},
        images: [{type : Types.ObjectId , ref : 'kyc_images'}],
        avatar: {type : Types.ObjectId , ref : 'uploads'},
        avatar_pos: {
            x : {type : Number, default : 0},
            y: {type : Number, default : 0},
            zoom: {type : Number, default : 1},
        },
        cover: {type : Types.ObjectId , ref : 'uploads'},
        cover_pos: {
            x : {type : Number, default : 0},
            y: {type : Number, default : 0},
            zoom: {type : Number, default : 1},
        },
    },
    sockets : {type : Array , default : []},
    kinglive : {
        total_followed : {type : Number , default : 0},
        total_follower : {type : Number , default : 0},
        total_view : {type : Number , default : 0},
        introduce : {type : Types.ObjectId, ref : 'videos'},
        total_stream_views : {type : Number , default : 0}
    }
});

const Users = mongoose.model('users', userSchema);
// userSchema.index({'kyc.first_name' : 'text' , 'kyc.first_name' : 'text'})

// Users.createIndexes()
// Users.updateMany({} , {
//     kinglive : {total_followed : 0 , total_follower : 0 , total_view : 0 , introduce : null},
// })
// .then(res => {
//     console.log(res);
// })