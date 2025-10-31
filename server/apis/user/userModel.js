const mongoose=require('mongoose');
const userSchema= new mongoose.Schema({
    "autoId":{type:Number,default:0},
    "name":{type:String,default:''},
    "email":{type:String,default:''},
    "profilepic":{type:String,default:''},
    "phoneNumber":{type:Number,default:''},
    "age":{type:Number,required:true},
    "password":{type:String,default:''},
    "isEmailVerified":{type:Boolean,default:false},
    "otp":{type:Number},
    "userType":{type:String,enum:["customer","driver"], default:"customer"},
    "isDeleted":{type:Boolean,default:false},
    "updatedAt":{type:Date,default:''},
    "createdAt":{type:Date,default:Date.now()},
    "status":{type:Boolean,default:true},
})
module.exports=mongoose.model("User",userSchema)