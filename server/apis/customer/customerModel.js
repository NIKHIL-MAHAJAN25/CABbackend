const mongoose = require('mongoose')
const customerSchema= mongoose.Schema({
   "userId":{type:mongoose.Schema.Types.ObjectId,
           ref:'User'},
    "emergencyContact":{type:Number,required:true},
    "paymentMethod":{type:String,required:true},
    "Language":{type:String,required:true}
})
module.exports=mongoose.model("Customer",customerSchema)