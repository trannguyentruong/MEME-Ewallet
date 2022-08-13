var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator')
const {registerValidator, loginValidator} = require('../middlewares/validator')
const userMethod = require('../apis/user/user.method')
const userAPI = require('../apis/user/user.api')
const {uploadMultiFile} = require('../middlewares/imageUploader')

//POST register user account
router.post('/register', registerValidator,uploadMultiFile, userMethod.registerUser)

//POST login
router.post('/login', loginValidator, userMethod.userLogin)

//POST change password for the first time login
router.post('/changePwd', userMethod.firstLoginRePassword)

//POST getOTP
router.post('/otp', userAPI.getOTP)

//POST verify otp
router.post('/verify', userAPI.getVerify)

router.post('/repass', userAPI.rePass)

router.post('/changepass', userAPI.changePass)

router.get('/profile/:id', userAPI.getUserProfile)

router.post('/profile/icid', uploadMultiFile, userMethod.reupICID)

router.get('/info/:id', userAPI.getUserInfo)

module.exports = router;