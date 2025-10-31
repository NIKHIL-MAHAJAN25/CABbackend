const db = require('../../config/db')
const User = db.User;
const Booking=db.Booking
const mail =require('../../utilities/mail')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
module.exports={
    createBooking,
    fetchBooking,
    acceptBooking,
    fetchStatus
}
async function fetchStatus(req,res){
    await fetchStatusFun(req)
    .then(data=>res.json(data))
    .catch(err=>res.json(err))
}
function fetchStatusFun(req){
    return new Promise(async (resolve,reject)=>{
    const formData=req.body || {}
    const find=await Booking.find({_id:formData.bookingId,status:'accepted'})
    .then(fetched=>{
        return resolve({
            status:200,
            success:true,
            message:"Fetched the bookings",
            data:fetched
        })
    })
    .catch(err=>{
        return reject({
            status:400,
            success:false,
            message:"error"+err,

        })
    })
})
}
async function acceptBooking(req,res){
    await acceptBookingFun(req)
   .then(data=>res.json(data))
    .catch(err=>res.json(err))
}
function acceptBookingFun(req){
        return new Promise(async(resolve,reject)=>{
            const formData=req.body;
            if(!formData?.bookingId || !formData.totalFare){
                return reject({
                status: 422,
                success: false,
                message: "Booking id and total fare is required"
            })
            }
            await Booking.findOne({_id:formData.bookingId})
            .then(booking=>{
                if(!booking){
                    return reject({
                        status: 404,
                        success: false,
                        message: "Booking doesn't exist"
                    })
                }
                if(booking.status!=='pending')
                {
                    return reject({
                        status:400,
                        success:false,
                        message:"This Booking is cancelled or "
                    })
                }
                booking.driverId=req.decoded._id
                booking.status='accepted'
                booking.totalFare=formData.totalFare
                mail.acceptMail({userEmail:req.decoded.email})
                booking.save()
               .then(data => {
                        resolve({
                            status: 200,
                            success: true,
                            message: "Booking Accepted",
                            data: data
                        })
                    })
                    .catch(err => {
                        reject({
                            status: 400,
                            success: false,
                            message: "Error while Accepting: " + err
                        })
                    })

            })
            .catch(err => {
                reject({
                    status: 500,
                    success: false,
                    message: "Database Error: " + err
                })
            })
    })
}





async function fetchBooking(req,res){
    await fetchBookingFun(req)
    .then(data=>res.json(data))
    .catch(err=>res.json(err))
}
function fetchBookingFun(req){
    return new Promise(async (resolve,reject)=>{
    const find=await Booking.find({status:'pending'})
    .then(fetched=>{
        return resolve({
            status:200,
            success:true,
            message:"Fetched the bookings",
            data:fetched
        })
    })
    .catch(err=>{
        return reject({
            status:400,
            success:false,
            message:"error"+err,

        })
    })
})
}
async function createBooking(req,res){
    await createBookingFun(req)
    .then(data=>res.json(data))
    .catch(err=>res.json())
}
function createBookingFun(req){
    const formData=req.body || {}
    return new Promise(async(resolve,reject)=>{
        let validation=''
        if(!formData.pickupLocation) validation += "Enter pickup Location"
        if(!formData.dropLocation) validation += "Enter Drop Location"
        if(!!validation){
            return reject({
                status:422,
                success:false,
                message:validation
            })
        }
        const num = await Booking.countDocuments({});
        let newBooking=new Booking({
            customerId:req.decoded._id,
            pickupLocation:formData.pickupLocation,
            dropLocation:formData.dropLocation,

        })
        const saved=await newBooking.save()
        .then(saved=>{
            resolve({
                status:200,
                success:true,
                message:"Booking made Successfully",
                data:saved
                
            })
        })
        .catch(err=>{
            reject({
                status:401,
                success:false,
                message:"Booking error",
                data:err
            })
        })
       
    })
}