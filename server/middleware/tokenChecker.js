const jwt=require('jsonwebtoken')
const SECRET_KEY=process.env.SECRET_KEY
const check=(req,res,next)=>{
    let token=req.headers.authorization;
    if(token){
        jwt.verify(token,SECRET_KEY,(err, decoded)=>{
             if(err){
                res.send({
                    status:401,
                    success:false,
                    message:"Unauthorized"
                })
             }else{
                req.decoded=decoded
                next()
             }
        })
    }else{
        res.send({
            status:400,
            success:false,
            message:"No token found"
        })
    }
}
module.exports=check