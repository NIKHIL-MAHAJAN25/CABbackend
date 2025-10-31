const mongoose=require('mongoose')
const dotenv = require('dotenv')
dotenv.config();
const URI=process.env.URI;
async function connect(){
    try{
        await mongoose.connect(URI);
        console.log("Connected with atlas");
    }catch(err){
        console.log("Error:",err);
    }
}
module.exports={
    Booking : require('../apis/booking/bookingModel'),
    Driver : require('../apis/driver/driverModel'),
    Customer:require('../apis/customer/customerModel'),
    User : require('../apis/user/userModel'),
}
connect();