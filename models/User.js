const mongoose = require('mongoose')
const schema = mongoose.Schema

const User = new schema({
    firstname: {
        type: String,
        required: true
    },
    lastname:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    birthday: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    ICID:{
        type: String,
        required: true,
        unique: true
    },
    frontIC:{
        type: String,
        required: true
    },
    backIC:{
        type: String,
        required: true
    }
});

User.statics.isThisEmailExist = async function(email){
    try {
        const user = await this.findOne({email})
        if(user){
            return false
        }
        return true
    } catch (error) {
        console.log("Email exist check error", error.message)
        return false
    }
}

User.statics.isThisICIDExist = async function(ICID){
    try {
        const user = await this.findOne({ICID})
        if(user) return false
        return true
    } catch (error) {
        console.log("Email exist check error", error.message)
        return false
    }
}

User.statics.isThisPhoneNumberExist = async function(phone){
    try {
        const user = await this.findOne({phone})
        if(user) return false
        return true
    } catch (error) {
        console.log("Email exist check error", error.message)
        return false
    }
}

module.exports = mongoose.model("User", User)