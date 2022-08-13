const User = require('../../models/User')
const Account = require('../../models/Account')
const {sendMailMessage} = require('../../middlewares/mailer')
const randomString = require('randomstring')
const bcrypt = require('bcrypt')

//Handle register process
var registerUser = async (req, res) =>{
    try{
        var error

        const {firstname, lastname, phone, email, birthday, address, ICcard} = req.body
        //Check duplicate email, Identity card and phone number
        const isEmailExist = await User.isThisEmailExist(email)
        const isICIDExist = await User.isThisICIDExist(ICcard)
        const isPhoneNumberExist = await User.isThisPhoneNumberExist(phone)
        if(!isEmailExist){
            error = "Email already exist"
        }
        if(!isICIDExist){
            error = "Identity number already exist"
        }
        if(!isPhoneNumberExist){
            error = "Phone number already exist"
        }
        if(error != undefined){
            //Create error message and redirect
            req.flash('error', error)
            res.redirect('/register')
        }
        else{
            //Create new user
            const user = new User({
                firstname: firstname,
                lastname: lastname,
                phone: phone,
                email: email,
                birthday: birthday,
                address: address,
                ICID: ICcard,
                frontIC: req.files.frontPhoto[0].path,
                backIC: req.files.backPhoto[0].path
            })
            //Save new user
            await user.save(function(err,user){
                if (err){
                    console.log(err);
                }
                else{
                    //Generate random username and password with type numeric
                    var username = randomString.generate({
                        length: 10,
                        charset: 'numeric'
                    });
                    var pass = randomString.generate({
                        length: 6,
                        charset: 'numeric'
                    })

                    const account = new Account({
                        email: user.email,
                        name: firstname + " " + lastname,
                        username: username,
                        password: bcrypt.hashSync(pass, 10), //pass hashed
                    })
                    account.save(function(err,result){
                        if (err){
                            console.log(err);
                        }
                        else{
                            const sub = "MeMe E-Wallet Account"
                            content = `
                            <div style="padding: 10px; background-color: #003375">
                                <div style="padding: 10px; background-color: white;">
                                    <h4 style="color: #0085ff">${sub}</h4>
                                    <p>Username: <strong>${result.username}</strong></p>
                                    <p>Password: <strong>${pass}</strong></p>
                                </div>
                            </div>
                            `
                            sendMailMessage(user.email, sub, content)
                            req.flash('success', 'Create account successfully, please check your mail to get username and password')
                            res.redirect('/register')
                        }
                    })
                }
            })
        }
    }
    catch(err){
        res.status(500).send("Server error")
    }
}

//Handle login process
var userLogin = async (req, res)=>{
    try{
        var error
        const username = req.body.username
        const password = req.body.pwdMot + req.body.pwdHai +  req.body.pwdBa +  req.body.pwdBon +  req.body.pwdNam +  req.body.pwdSau 
        Account.findOne({username: username}, (err, user)=>{
            if(err){
                throw err
            }
            if(!user){
                error = "Username or password not match"
                req.flash('error', error)
                return res.redirect('/login')
            }
            if(user){
                if(user.status == "Deactivated"){
                    error = "This account has been deactivated, please contact hotline 18001008"
                    req.flash('error', error)
                    return res.redirect('/login')
                }
                if(user.status == "Blocked"){
                    error = "Your have try to login but fail many time. Your account have been block infinity, contact to admin for support"
                    req.flash('error', error)
                    return res.redirect('/login')
                }
                if(user.status == 'Locked'){
                    var current = new Date()
                    var timeBlock = user.blockTime

                    currentMin = current.getTime()

                    if(currentMin - timeBlock <= 60000){
                        error = "Your account have been temporarily locked, please try again after 1 minutes"
                        req.flash('error', error)
                        return res.redirect('/login')
                    }
                    else{
                        Account.updateOne({email: user.email}, {errorTimes: 0, status: user.exStatus,abnormal: 1 },(err, result)=>{
                            if(result){
                                bcrypt.compare(password, user.password,(err, result)=>{
                                    if(err){
                                        throw err
                                    }
                                    if(result){
                                        if(user.exPassword.length == 0){
                                            //Create session for logined
                                            req.session.first = true
                                            req.session.login = true
                                            req.session.role = user.role
                                            req.session.email = user.email
                                            req.session.uid = user.username
                                            req.session.name = user.name
                                            req.session.stt = user.status
                                            if(user.role == 'Admin'){
                                                //301 code to redirect from router to another router
                                                return res.redirect(301,'/admin')
                                            }
                                            return res.redirect('/')
                                        }
                                        else{
                                            //Create session for logined
                                            req.session.first = false
                                            req.session.login = true
                                            req.session.uid = user.username
                                            req.session.role = user.role
                                            req.session.email = user.email
                                            req.session.name = user.name
                                            req.session.stt = user.status
                                            if(user.role == 'Admin'){
                                                //301 code to redirect from router to another router
                                                return res.redirect(301,'/admin')
                                            }
                                            return res.redirect('/')
                                        }
                                    }
                                    else{
                                        if(user.errorTimes + 1 != 3){
                                            Account.updateOne({email: user.email}, {errorTimes: user.errorTimes +1},(err, result)=>{
                                                if(result){
                                                    error = "Username or password not match"
                                                    req.flash('error', error)
                                                    res.redirect('/login')
                                                }
                                            })
                                        }
                                        else{
                                            if(user.abnormal == 1){
                                                
                                                Account.updateOne({email: user.email}, {status: "Blocked",},(err, result)=>{
                                                    if(result){
                                                        error = "Username or password not match"
                                                        req.flash('error', error)
                                                        res.redirect('/login')
                                                    }
                                                })
                                            }
                                            var current = new Date()
                                            var currentMin = current.getTime()
                                            Account.updateOne({email: user.email}, {errorTimes: 0, status: "Locked", exStatus: user.status, blockTime: currentMin },(err, result)=>{
                                                if(result){
                                                    error = "Username or password not match"
                                                    req.flash('error', error)
                                                    res.redirect('/login')
                                                }
                                            })
                                        }
            
                                    }
                                })
                            }
                        })
                    }
                }
                else{
                    bcrypt.compare(password, user.password,(err, result)=>{
                        if(err){
                            throw err
                        }
                        if(result){
                            if(user.exPassword.length == 0){
                                //Create session for logined
                                req.session.first = true
                                req.session.login = true
                                req.session.role = user.role
                                req.session.email = user.email
                                req.session.uid = user.username
                                req.session.name = user.name
                                req.session.stt = user.status
                                if(user.role == 'Admin'){
                                    //301 code to redirect from router to another router
                                    return res.redirect(301,'/admin')
                                }
                                return res.redirect('/')
                            }
                            else{
                                //Create session for logined
                                req.session.first = false
                                req.session.login = true
                                req.session.uid = user.username
                                req.session.role = user.role
                                req.session.email = user.email
                                req.session.name = user.name
                                req.session.stt = user.status
                                if(user.role == 'Admin'){
                                    //301 code to redirect from router to another router
                                    return res.redirect(301,'/admin')
                                }
                                return res.redirect('/')
                            }
                        }
                        else{
                            if(user.errorTimes + 1 != 3){
                                Account.updateOne({email: user.email}, {errorTimes: user.errorTimes +1},(err, result)=>{
                                    if(result){
                                        error = "Username or password not match"
                                        req.flash('error', error)
                                        res.redirect('/login')
                                    }
                                })
                            }
                            else{
                                if(user.abnormal == 1){
                                                
                                    Account.updateOne({email: user.email}, {status: "Blocked",},(err, result)=>{
                                        if(result){
                                            error = "Username or password not match"
                                            req.flash('error', error)
                                            res.redirect('/login')
                                        }
                                    })
                                }
                                else{
                                    var current = new Date()
                                    var currentMin = current.getTime()
                                    Account.updateOne({email: user.email}, {errorTimes: 0, status: "Locked", exStatus: user.status, blockTime: currentMin },(err, result)=>{
                                        if(result){
                                            error = "Username or password not match"
                                            req.flash('error', error)
                                            res.redirect('/login')
                                        }
                                    })
                                }
                            }

                        }
                    })
                }
            }
        })
    }
    catch{
        res.status(500).send("Server error")
    }
}

var firstLoginRePassword = async (req, res) =>{
    try {
        const email = req.session.email
        const password = req.body.pwdMot + req.body.pwdHai +  req.body.pwdBa +  req.body.pwdBon +  req.body.pwdNam +  req.body.pwdSau 
        const hashed = bcrypt.hashSync(password, 10)

        Account.findOne({email: email}, (err, account)=>{
            if(err){
                console.log(err)
            }
            if(account){
                Account.updateOne({email: email},{ password: hashed, exPassword: account.password}, function(err, result){

                    if(result){
                        req.session.first = false
                        return res.redirect('/')
                    }
                })
            }
        })
    } catch (err) {
        res.status(500).send("Server error")
    }
}

var reupICID = async(req, res)=>{
    User.updateOne({email: req.session.email},{frontIC: req.files.frontPhoto[0].path, backIC: req.files.backPhoto[0].path},(err, result)=>{
        if(result){
            const success = "Upload image successfully, please wait for admin to confirm your infomation"
            req.flash('success', success)
            res.redirect('/user/profile/'+req.session.uid)
        }
    })
}

module.exports = {
    registerUser,
    userLogin,
    firstLoginRePassword,
    reupICID,
}