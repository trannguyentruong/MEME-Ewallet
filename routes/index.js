var express = require('express');
var router = express.Router();
const firstLogin = require('../middlewares/first-login');
const checkAuth = require('../middlewares/checkAuth')
const checkRoleAdmin = require('../middlewares/checkRoleAdmin')

/* GET home page. */
router.get('/', firstLogin, (req, res) =>
{
    const login = req.session.login
    // need firstname here to show in the header
    // need login yes to user the header-logged, if login no => user header, you can change this
    res.render('index', { title: 'MeMe', login, name: req.session.name,id: req.session.uid , address:'home' });
})

//Get login page
router.get('/login',checkAuth, firstLogin, (req, res) =>
{
    const error = req.flash('error')
    res.render('login', { title: 'Login', layout: './layouts/non-partial' ,address:'home',error});
})

//Get user profile 

//Get register page
router.get('/register',checkAuth,firstLogin, (req, res) =>
{
    const error = req.flash('error')
    const success = req.flash('success')
    res.render('register', { title: 'Register', layout: './layouts/non-partial' ,error, success});
})

// first login interface
router.get('/first-login',firstLogin, (req, res) =>
{
    res.redirect('/')
})

//Get login page
router.get('/forgot',checkAuth, firstLogin, (req, res) =>
{
    const error = req.flash('error')
    const success = req.flash('success')
    res.render('forgot-pwd', { title: 'Forgot password', layout: './layouts/non-partial', error , success});
})

router.get('/logout', (req, res) =>{
    req.session.destroy((err) => {
        res.redirect('/')
    })
})

router.get('/about', (req, res)=>{
    res.render('about', { title: 'MeMe', login: req.session.login, name: req.session.name,id: req.session.uid , address:'about' })
})

router.get('/services', (req,res)=>{
    if(req.session.login){
        res.render('service', { title: 'MeMe',email: req.session.email, login: req.session.login, name: req.session.name,id: req.session.uid , address:'services', status: req.session.stt })
    }
    else{
        res.redirect('/')
    }
})



module.exports = router;