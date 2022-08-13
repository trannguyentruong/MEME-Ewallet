var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('connect-flash')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const Account = require('./models/Account')


var indexRouter = require('./routes/index');
const userRouter = require('./routes/user.router')
const adminRouter = require('./routes/admin.router')
const transactionRouter = require('./routes/trans.router')

var app = express();
//Connect locahost mongodb
mongoose.connect('mongodb://localhost:27017/local')

//Create admin account
Account.findOne({email: 'admin@gmail.com'}, (err, account)=>{
    if(!account){
        const account = new Account({
            email: 'admin@gmail.com',
            name: 'Admin',
            username: 'admin',
            role: 'Admin',
            status: "Verified",
            exPassword: bcrypt.hashSync("123456", 10),
            password: bcrypt.hashSync("123456", 10), //pass hashed
        })
        return account.save()
    }
})


// static files
app.use(express.static(path.join(__dirname, 'public')));
// app.use('/css', express.static(__dirname + 'public/css'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

//Config session
app.use(session({
    secret: 'memeewallet',
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 60*60*1000 }
}))
//Flash message
app.use(flash());

//Set var for root
app.use((req, res, next)=>{
req.vars = {root: __dirname}
next()
})
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(bodyParser.urlencoded({extended: false}))


app.use('/', indexRouter)
app.use('/admin',adminRouter)
app.use('/user', userRouter)
app.use('/trans', transactionRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next)
{
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next)
{
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error', layout: './layouts/non-partial' });
});

module.exports = app;