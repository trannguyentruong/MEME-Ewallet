var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt'),
    path = require('path')
    randomstring = require("randomstring");

//Load homepage
const loadHomePage = (req, res) => {
    // console.log(req.flash('avatar')[0])
    return res.render('index');
}

//Ensure auth for homepage
const ensureAuth = (req, res, next) => {
    if(req.session.user){
        return next()
    }
    return res.redirect('/home')
}

const loadDashboard = (req, res) => {
    return res.render('home')
}

module.exports = {
    loadHomePage: loadHomePage,
    checkAuth: ensureAuth,
    loadDashboard: loadDashboard,
}