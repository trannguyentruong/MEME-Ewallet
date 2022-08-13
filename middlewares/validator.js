const {check} = require('express-validator')

let d = new Date();
let year = d.getFullYear();
let month = d.getMonth();
let day = d.getDate();
let cA = new Date(year - 18, month, day).toDateString();
let cB = new Date(year - 65, month, day).toDateString();

const registerValidator =  [
    check('firstname').exists().withMessage("Please input firstname")
    .notEmpty().withMessage("Firstname cannot be blank"),
    
    check('lastname').exists().withMessage("Please input lastname")
    .notEmpty().withMessage("Lastname cannot be blank"),

    check('email').exists().withMessage("Please input email")
    .notEmpty().withMessage("Email cannot be blank")
    .isEmail().withMessage("Wrong email format"),

    check('birthday').exists().withMessage("Please select your birthday")
    .notEmpty().withMessage("Birthday field can not be empty"),
]

const loginValidator = [
    check('username').exists().withMessage("Please input lastname")
    .notEmpty().withMessage("Lastname cannot be blank"),

    check('password-1').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),

    check('password-2').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),

    check('password-3').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),

    check('password-4').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),

    check('password-5').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),

    check('password-6').exists().withMessage("Please type password")
    .notEmpty().withMessage("Password cannot be blank"),
]

module.exports = { registerValidator, loginValidator}