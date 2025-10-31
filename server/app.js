const express=require('express');
const app=express();
const userRoutes=require('./routes/userRoutes')
const dotenv = require('dotenv')
dotenv.config();
app.use(express.json())
app.use(express.urlencoded({extended:true}));
const PORT=process.env.PORT;
app.get('/',(req,res)=>{
    res.end("Welcome to Cab Booking App")
})


app.use('/User',userRoutes)

app.all(/(.*)/, (req, res) => {
    res.send({
        status: 404,
        success: false,
        message: "No such API!!"
    })
})

app.listen(PORT, () => {
    console.log("Server is running at port:", PORT);
});