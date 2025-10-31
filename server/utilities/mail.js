const nodemailer=require('nodemailer')
let email=process.env.email
let password=process.env.password
module.exports={
    sendOtpMail,
    sendWelcome,
    acceptMail
}
const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    auth:{
        user:email,
        pass:password
    }
});
async function acceptMail(params){
    const mailContent=`<p>Your Ride has been Accepted<br/> <br/>
    Congratulations your ride has been accepted,kindly Proceed to your Pickup Point <br/> <br/>
    Regards,<br/>
    App management Team!!</p>`
    const message={
        from:'Nikhil Mahajan',
        to:params.userEmail,
        subject:"Welcome Message",
        html:mailContent,
    }
    try{
        await transporter.sendMail(message)
        console.log("Mail sent")
    }catch(err){
        console.log("Error sending mail:"+err);
    }
}
async function sendWelcome(params){
    const mailContent=`<p>Welcome to Our App <br/> <br/>
    Thanks for registering on our app<br/> <br/>
    Regards,<br/>
    App management Team!!</p>`
    const message={
        from:'Nikhil Mahajan',
        to:params.userEmail,
        subject:"Welcome Message",
        html:mailContent,
    }
    try{
        await transporter.sendMail(message)
        console.log("Mail sent")
    }catch(err){
        console.log("Error sending mail:"+err);
    }
}
async function sendOtpMail(params){
    const mailContent=`<p>Welcome to Our App <br/> <br/>
    Your otp for Email verification is: <br/> <br/>
    <b>${params.otp}</b><br/> <br/>
    Regards,<br/>
    App management Team!!</p>`
    const message={
        from:'Nikhil Mahajan',
        to:params.userEmail,
        subject:"OTP for Email Verification",
        html:mailContent,
    }
    try{
        await transporter.sendMail(message)
        console.log("Mail sent")
    }catch(err){
        console.log("Error sending mail:"+err);
    }
}