const mongoose = require('mongoose')
const bookingSchema= mongoose.Schema({
    "autoId":{type:Number,default:0},
    "customerId":{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    "driverId":{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    "pickupLocation":{type:String,required:true},
    "dropLocation":{type:String,required:true},
    "totalFare":{type:Number,default:0},
    "status":{type:String,enum:['pending','accepted','cancelled'],default:'pending'}
    
},{
    timestamps:true
})
module.exports=mongoose.model("Booking",bookingSchema)