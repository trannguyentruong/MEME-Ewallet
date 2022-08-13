const Account = require('../../models/Account')
const User = require('../../models/User')
const Transaction = require('../../models/Transaction')
const path = require('path')

var getAccounts = async(req, res)=>{
    try {
        const accounts = await Account.find({ "username": { $ne: "admin" } });
        const accountsInfo = await Promise.all(
            accounts.map(async(account) => {
                return {
                    id: account._id,
                    username: account.username,
                    email: account.email,
                    created: account.createdAt,
                    updated: account.updatedAt,
                    status: account.status
                };
            }
        ))
        return res.json(accountsInfo);
    } catch (err) {
        res.status(500).send("Server error")
    }
}

var getAccountsByStt = async(req, res)=>{
    try {
        const stt = req.params.stt
        const accounts = await Account.find({status: stt}).sort({'updatedAt':-1});
        console.log(accounts)
        const accountsInfo = await Promise.all(
            accounts.map(async(account) => {
                if(account.username != 'admin'){
                    return {
                        id: account._id,
                        username: account.username,
                        email: account.email,
                        created: account.createdAt,
                        updated: account.updatedAt,
                        status: account.status
                    };
                }
            }
        ))
        return res.json(accountsInfo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

var getAccountUserInfo = async (req, res)=>{
    try {
        Account.findOne({_id: req.params.id}, (err, account)=>{
            if(err) throw err
            if(account){
                User.findOne({email: account.email}, (err, user)=>{
                    if(err) throw err
                    if(user){
                        //Static folder for image
                        const frontAllPath = user.frontIC.split(path.sep)
                        const front = frontAllPath[frontAllPath.length - 2] + '/' + frontAllPath[frontAllPath.length - 1]

                        const backAllPath = user.backIC.split(path.sep)
                        const back = backAllPath[backAllPath.length - 2] + '/' + backAllPath[backAllPath.length - 1]

                        const infoFilter = {name: account.name, phone: user.phone, email: user.email, birthday: user.birthday, address: user.address, ICID: user.ICID, status: account.status, front: front, back: back}
                        res.render('admin-user-detail', { title: 'Admin', layout: './layouts/admin', address: 'user', userid: req.params.id ,infoFilter})
                    }
                })
            }
        })
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

var updateAccountStatus = async(req, res)=>{
    try {
        Account.findOne({email: req.params.email}, (err, account)=>{
            if(err) throw err
            if(account){
                console.log(account)
                User.findOne({email: account.email}, (err, user)=>{
                    if(err) throw err
                    if(user){
                        Account.updateOne({email: req.params.email},{ status: req.params.status}, function(err, result){
                            if(err){
                                throw err
                            }
                            if(result){
                                return res.json({status: req.params.status})
                            }
                            else{
                                return res.json({error: "Something happend, please reload website and try again"})
                            }
                        })
                    }
                })
            }
        })
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

var getTransactions = async (req, res)=>{
    try {
        const transactions = await Transaction.find({});
        const transactionsInfo = await Promise.all(
            transactions.map(async(transaction) => {
                return {
                    id: transaction._id,
                    username: transaction.username,
                    type: transaction.typeTrans,
                    amount: transaction.amount,
                    time: transaction.createdAt,
                    status: transaction.status
                };
            }
        ))
        console.log(transactionsInfo)
        return res.json(transactionsInfo);
    } catch (err) {
        res.status(500).send("Server error")
    }
}

var getTransactionsByStt = async (req, res)=>{
    try {
        const stt = req.params.stt
        const transactions = await Transaction.find({status: stt}).sort({'updatedAt':-1});
        const transactionsInfo = await Promise.all(
            transactions.map(async(transaction) => {
                return {
                    id: transaction._id,
                    username: transaction.username,
                    type: transaction.typeTrans,
                    amount: transaction.amount,
                    time: transaction.createdAt,
                    status: transaction.status
                };
            }
        ))
        console.log(transactionsInfo)
        return res.json(transactionsInfo);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getAccounts,
    getAccountsByStt,
    getAccountUserInfo,
    updateAccountStatus,
    getTransactions,
    getTransactionsByStt
}