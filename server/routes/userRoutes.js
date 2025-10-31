const router = require('express').Router();
const multer = require('multer');
const UserController = require('../apis/user/userController')
const bookingController=require('../apis/booking/bookingController')



const diskStorage=multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, './server/public/students')
    },
    filename: function(req, file, cb){
        let FILENAME=`${Date.now()}-${file.originalname}`
        return cb(null, FILENAME)
    }
})

const studentUpload = multer({storage: diskStorage})




router.post('/register',UserController.registerUser)
router.post('/login',UserController.loginUser) 
router.use(require('../middleware/tokenChecker')) 
router.post('/new-book',bookingController.createBooking)
router.post('/bookings',bookingController.fetchBooking)
router.post('/accept',bookingController.acceptBooking)
router.post('/fetchStatus',bookingController.fetchStatus)






router.all(/(.*)/, (req, res)=>{
    res.send({
        status: 404, 
        success: false, 
        message:"No such API!!"
    })
})

module.exports = router;