const User = require('../../models/User')
const bcrypt = require('bcrypt')
const Account = require('../../models/Account')
const OTP = require('../../models/Token')
const randomString = require('randomstring')
const {sendMailMessage} = require('../../middlewares/mailer')
const path = require('path')
const Transaction = require('../../models/Transaction')

var getOTP = async (req, res) =>{
    try {
        const {email} = req.body
        Account.findOne({email: email}, (err, account)=>{
            if(err){
                console.log(err)
            }
            if(account){
                var otp = randomString.generate({
                    length: 6,
                    charset: 'numeric'
                })
                OTP.findOne({email: email}, (err, result)=>{
                    if(err) throw err
                    if(result){
                        OTP.updateOne({email: email},{ OTP: otp}, function(err, result){
                            if(err){
                                throw err
                            }
                            if(result){
                                const sub = "MeMe E-Wallet Forgot Password OTP"
                                content = `
                                <div style="padding: 10px; background-color: #003375">
                                    <div style="padding: 10px; background-color: white;">
                                        <h4 style="color: #0085ff">${sub}</h4>
                                        <p>Your OTP: <strong>${otp}</strong></p>
                                    </div>
                                </div>
                                `
                                sendMailMessage(account.email, sub, content)

                                return res.json({success: true, email: account.email, error:""})
                            }
                            else{
                                return res.json({error:"Something happend, please reload website and try again"}) 
                            }
                        })
                    }
                    else{
                        const newOTP = new OTP({
                            email: email,
                            OTP: otp
                        })
                        newOTP.save(function(err,result){
                            if(err){
                                throw err
                            }
                            if(result){
                                const sub = "MeMe E-Wallet Forgot Password OTP"
                                content = `
                                <div style="padding: 10px; background-color: #003375">
                                    <div style="padding: 10px; background-color: white;">
                                        <h4 style="color: #0085ff">${sub}</h4>
                                        <p>Your OTP: <strong>${result.OTP}</strong></p>
                                    </div>
                                </div>
                                `
                                sendMailMessage(result.email, sub, content)

                                return res.json({success: true, email: result.email,error:""})
                            }
                            else{
                                return res.json({error:"Something happend, please reload website and try again"})
                            }
                        })
                    }
                })
            }else{
                return res.json({error:"Email not exist"})
            }
        })
    } catch (err) {
        console.log(err.message)
        return res.status(500).send('Server Error');
    }
}

var getVerify = async (req, res)=>{
    try {
        const {code} = req.body
        OTP.findOne({_OTP: code}, (err, result)=>{
            if(err) throw err
            if(result){
                req.session.forgotEmail = result.email
                return res.json({success: true, error:""})
            }
            else{
                return res.json({error: "OTP expired"})
            }
        })
    } catch (error) {
        res.status(500).send("Server error")   
    }
}

var rePass = async( req, res)=>{
    try {
        const {pass} = req.body
        const email = req.session.forgotEmail
        if(email.length <= 0){
            res.json({error: "Cheating action detected"})
        }
        const hashed = bcrypt.hashSync(pass, 10)
        Account.findOne({email: email}, (err, account)=>{
            if(err){
                throw err
            }
            if(account){
                Account.updateOne({email: email},{ password: hashed, exPassword: account.password}, function(err, result){
                    if(err){
                        throw err
                    }
                    if(result){
                        return res.json({success: true, error:""})
                    }
                    else{
                        return res.json({error: "Something happend, please reload website and try again"})
                    }
                })
            }
        })
    } catch (error) {
        res.status(500).send("Server error")  
    }

}

var getUserProfile = async (req, res)=>{
    try {
        if(req.session.login){
            Account.findOne({username: req.params.id}, (err, account)=>{
                if(err) throw err
                if(account){
                    console.log(account)
                    User.findOne({email: account.email},async (err, user)=>{
                        if(err) throw err
                        if(user){
                            const transactions = await Transaction.find({username: account.username}).sort({'createdAt':-1});
                            const transInfo = await Promise.all(
                                transactions.map(async (transaction) => {
                                    if(account.username != 'admin'){
                                        return {
                                            id: account._id,
                                            username: transaction.username,
                                            type: transaction.typeTrans,
                                            amount: transaction.amount,
                                            total: Number(transaction.amount)+ Number(transaction.fee),
                                            time: transaction.createdAt,
                                            status: transaction.status
                                        };
                                    }
                                }
                            ))
                            console.log(transInfo)
                            //Static folder for image
                            const frontAllPath = user.frontIC.split(path.sep)
                            const front = frontAllPath[frontAllPath.length - 2] + '/' + frontAllPath[frontAllPath.length - 1]
    
                            const backAllPath = user.backIC.split(path.sep)
                            const back = backAllPath[backAllPath.length - 2] + '/' + backAllPath[backAllPath.length - 1]
    
                            const inforFilter = {name: account.name, phone: user.phone, email: user.email, birthday: user.birthday, address: user.address, ICID: user.ICID, status: account.status, front: front, back: back, balance: account.balance}
                            const success = req.flash('success')
                            res.render('profile', {name:account.name, title: account.name, layout: './layouts/main', address: 'profile', id: req.session.uid, login: req.session.login  ,inforFilter, success, transInfo})
                        
                        }
                    })
                }
            })
        }
        else{
            return res.redirect('/')
        }
    } catch (err) {
        res.status(500).send("Server error")
    }
}

var changePass = async( req, res)=>{
    try {
        const {pass, current} = req.body
        const email = req.session.email
        const hashed = bcrypt.hashSync(pass, 10)
        Account.findOne({email: email}, (err, account)=>{
            if(err){
                throw err
            }
            if(account){
                bcrypt.compare(current, account.password,(err, result)=>{
                    if(result){
                        Account.updateOne({email: email},{ password: hashed, exPassword: account.password}, function(err, result){
                            if(err){
                                throw err
                            }
                            if(result){
                                return res.json({success: true, error:""})
                            }
                            else{
                                return res.json({error: "Something happend, please reload website and try again"})
                            }
                        })
                    }
                    else{
                        res.json({error: "Your current password is wrong"})
                    }
                })

            }
        })
    } catch (error) {
        res.status(500).send("Server error")  
    }
}

var getUserInfo = async(req, res)=>{
    try {
        User.findOne({phone: req.params.id},(err, user)=>{
            if(user){
                res.json({
                    name: user.firstname + " " + user.lastname,
                    lastname: user.lastname,
                    firstname: user.firstname,
                    birthday: user.birthday,
                    address: user.address,
                    phone: user.phone,
                    ICID: user.ICID,
                    frontIC: user.frontIC,
                    backIC: user.backIC
                })
            }
            else{
                res.json({error:"Undefined error"})
            }
        })
    } catch (error) {
        res.status(500).send("Server error")
    }
}

module.exports = {
    getOTP,
    getVerify,
    rePass,
    getUserProfile,
    changePass,
    getUserInfo
}