const mongoose = require('mongoose')
const schema = mongoose.Schema

//Column for forgot password
const CVV = new schema({
    uid: {
        type: String,
        required: true,
        unique:true
    },
    creditID: {
        type: String,
        required: true,
        unique: true
    },
    outdateAt: {
        type: Date,
        required: true,
    },
    codeCVV:{
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model("CVV", CVV)