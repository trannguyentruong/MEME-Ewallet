const mongoose = require('mongoose')
const schema = mongoose.Schema

//Column for forgot password
const Transaction = new schema({
    username: {
        type: String,
        required: true,
    },
    creditID: {
        type: String,
    },
    typeTrans:{
        type: String,
        required: true
    },
    amount:{
        type: Number,
    },
    outdateAt: {
        type: Date,
    },
    codeCVV:{
        type: String,
    },
    note: {
        type: String,
    },
    status:{
        type: String,
        default: "Pending"
    },
    fee:{
        type: Number,
        default: 0
    },
    from:{
        type: String,
        required: true,
    },
    to:{
        type: String,
        required: true,
    }
}, {timestamps: true})

module.exports = mongoose.model("Transaction", Transaction)