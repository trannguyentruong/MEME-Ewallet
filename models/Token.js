const mongoose = require('mongoose')
const schema = mongoose.Schema

//Column for forgot password
const Token = new schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    OTP: {
        type: String,
        required: true,
        unique: true
    },
}, {timestamps: true})

Token.index({createdAt: 1},{expireAfterSeconds: 60});

module.exports = mongoose.model("Token", Token)