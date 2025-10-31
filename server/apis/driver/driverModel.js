const mongoose=require('mongoose')
const driverSchema=mongoose.Schema({
    "userId":{type:mongoose.Schema.Types.ObjectId,
        ref:'User'},
    "car":{type:String,required:true},
    "farePerKM":{type:Number,default:5},
    "license":{type:String,required:true},
    "isAvailable":{type:Boolean,default:true}

})
module.exports=mongoose.model("Driver",driverSchema)
