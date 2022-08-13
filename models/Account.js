const mongoose = require('mongoose')
const schema = mongoose.Schema

const Account = new schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    name:{
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    balance:{
        type: Number,
        default: 0
    },
    role:{
        type: String,
        required: true,
        default: 'User'
    },
    status:{
        type: String,
        required: true,
        default: 'Pending'
    },
    exPassword:{
        type: String,
        default: ''
    },
    exStatus:{
        type: String,
    },
    blockTime:{
        type: String
    },
    errorTimes:{
        type: Number,
        default: 0
    },
    abnormal:{
        type: Number
    }
}, {timestamps: true})

module.exports = mongoose.model("Account", Account)