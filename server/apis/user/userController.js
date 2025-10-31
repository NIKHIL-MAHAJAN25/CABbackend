const db = require('../../config/db')
const User = db.User;
const mail=require('../../utilities/mail')

const Customer = db.Customer;
const Driver = db.Driver;
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')
dotenv.config();
module.exports = {
    registerUser,
    loginUser
}
// bvwc tmew eypl nruz
async function loginUser(req,res){
    await loginUserFun(req)
        .then(data=>res.json(data))
        .catch(err=>res.json(err))
}
async function loginUserFun(req){
    try{
        const formData=req.body || {}
        let validation=''
        if(!formData.email) validation +="email is required"
        if(!formData.password) validation +="password is required"
        if(!!validation){
           throw({
                status:422,
                success:false,
                message:validation
            })
        }
        const found=await User.findOne({email:formData.email})
        if(!found){
            throw({
                status:404,
                success:false,
                message:"User does not exist"
            })
        }
        else{
            if(found.isDeleted){
               throw({
                    status:401,
                    success:false,
                    message:"Account inactive please contact admin"
                })
            }else{
                let passmatch=bcrypt.compareSync(formData.password,found.password)
                if(passmatch){
                    let payload={
                        _id:found._id,
                        name:found.name,
                        email:found.email,
                        userType:found.userType
                    }
                    const SECRET_KEY=process.env.SECRET_KEY
                    let token = jwt.sign(payload,SECRET_KEY)
                    throw({
                        status:200,
                        success:true,
                        message:"Login successfull",
                        data:found,
                        token:token
                    })
                }else{
                    throw({
                        status:401,
                        success:false,
                        message:"invalid email or password"
                    })
                }
            }
        }

    }catch(err){
            throw err;
    }
}
async function registerUser(req, res) {
    await registerUserFun(req)
        .then(data => res.json(data))
        .catch(err => res.json(err))
}
function registerUserFun(req) {
    return new Promise(async (resolve, reject) => {
        let formData = req.body || {};
        let validation = ''
        if (!formData.email) validation += "Email is required"
        if (!formData.password) validation += "password is required"
        // if (!formData.profilePic) validation += "Image is required"
        if (!formData.phoneNumber) validation += "Phone is required"
        if (!formData.age) validation += "age is required"
        if (!formData.name) validation += "name is required"
        if (!formData.userType) validation += "Type is required"
        if (!!validation) {
            return reject({
                status: 422,
                success: false,
                message: validation
            })
        }
        await User.findOne({ email: formData.email })
            .then(async userData => {

                if (userData) {
                    return reject({
                        status: 404,
                        success: false,
                        message: "User already exists"
                    })
                } else {
                    const num = await User.countDocuments({});
                    let newUser = new User()
                    newUser.autoId = num + 1;
                    newUser.name = formData.name
                    newUser.email = formData.email
                    newUser.age = formData.age
                    newUser.userType = formData.userType
                    newUser.phoneNumber = formData.phoneNumber
                    newUser.password = bcrypt.hashSync(formData.password, 10)
                    const savedUser = await newUser.save()
                    await mail.sendWelcome({userEmail:savedUser.email})
                    
                    if (formData.userType == 'customer') {
                        const newCustomer = new Customer({
                            userId: savedUser._id,
                            emergencyContact: formData.emergencyContact,
                            paymentMethod: formData.paymentMethod,
                            Language: formData.Language

                        });
                       
                        await newCustomer.save()
                            .then(saved => {
                                resolve({
                                    status: 200,
                                    success: true,
                                    message: "Customer added successfuly Proceed to booking End Point",
                                    data: {
                                        savedUser,
                                        saved
                                    }
                                })
                            })

                            .catch(err => {
                                reject({
                                    status: 400,
                                    success: false,
                                    message: "Error: " + err
                                })
                            })
                    }
                    else if (formData.userType == 'driver') {
                        const newDriver = new Driver({
                            car:formData.car,
                            userId:savedUser._id,
                            farePerKM: formData.farePerKM,
                            license: formData.license,
                        })
                        await newDriver.save()
                            .then(saved => {
                                resolve({
                                    status: 200,
                                    success: true,
                                    message: "Driver added successfuly Proceed to booking End Point",
                                    data: {
                                        saved
                                    }
                                })
                            })
                            .catch(err => {
                                reject({
                                    status: 400,
                                    success: false,
                                    message: "Error: " + err
                                })
                            })
                    }

                }
            })
            .catch(err=>{
                    return reject({
                        status:400,
                        success:false,
                        message:"Server error"+err
                    })
                })
            })
        }

    
