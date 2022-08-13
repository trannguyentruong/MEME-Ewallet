const Transaction = require('../../models/Transaction')
const Account = require('../../models/Account')

var getTransaction = async (req, res)=>{
    try {
        const {amount, card, expiry, cvv, note} = req.body
        if(req.params.type == "Recharge"){
            const transaction = new Transaction({
                username: req.session.uid,
                creditID: card,
                typeTrans: req.params.type,
                outdateAt: expiry,
                codeCVV: cvv,
                amount: amount,
                note: note,
                from: card,
                to: req.session.uid,
            })
            transaction.save((err, result)=>{
                if(err){
                    console.log(err)
                }
                if(result){ 
                    Transaction.updateOne({_id: result._id},{status: "Success"},(err, update)=>{
                        if(update){
                            Account.findOne({username: req.session.uid}, (err, founded)=>{
                                if(founded){
                                    Account.updateOne({username: req.session.uid}, {balance: Number(founded.balance) + Number(amount)},(err, updateBalance)=>{
                                        if(updateBalance){
                                            return res.json({success: true, error: ""})
                                        }
                                        else{
                                            return res.json({success: false, error: "Something happend, please reload website and try again"})
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
        if(req.params.type == "Withdraw"){
            var fee = (Number(amount)/100)*5
            if(Number(amount)%50000 !=0){
                return res.json({successs: false, error: "Withdrawal amount must be a multiple of 50,000VND"})
            }
            Account.findOne({username: req.session.uid},(err, account)=>{
                if(Number(account.balance)-Number(amount) > 0){
                    const transaction = new Transaction({
                        username: req.session.uid,
                        creditID: card,
                        typeTrans: req.params.type,
                        outdateAt: expiry,
                        codeCVV: cvv,
                        amount: amount,
                        note: note,
                        fee: fee,
                        from: req.session.uid,
                        to: card
                    })
                    transaction.save((err, result)=>{
                        if(err){
                            console.log(err)
                        }
                        if(result){ 
                            var status = ""
                            if(Number(amount) >= 5000000){
                                status = "Pending"
                            }
                            else{
                                status = "Success"
                            }
                            Transaction.updateOne({_id: result._id},{status: status},(err, update)=>{
                                if(update){
                                    Account.findOne({username: req.session.uid}, (err, founded)=>{
                                        if(founded){
                                            if(status == "Success"){
                                                Account.updateOne({username: req.session.uid}, {balance: Number(founded.balance) - Number(amount) - fee},(err, updateBalance)=>{
                                                    if(updateBalance){
                                                        return res.json({success: true, error: ""})
                                                    }
                                                    else{
                                                        return res.json({success: false, error: "Something happend, please reload website and try again"})
                                                    }
                                                })
                                            }
                                            else{
                                                return res.json({success: true, error: ""})
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    } catch (err) {
        res.status(500).send("Server error")
    }
}

var getTransfer = async (req, res)=>{
    const {receiver, feeler, amount, note} = req.body
    var fee = (Number(amount)/100)*5
    Account.findOne({username: req.session.uid},(err, account)=>{
        if(account){
            if(Number(account.balance)-Number(amount) > 0){
                const transaction = new Transaction({
                    username: req.session.uid,
                    typeTrans: 'Transfer',
                    amount: amount,
                    note: note,
                    fee: fee,
                    from: req.session.uid,
                    to: receiver
                })
                transaction.save((err, result)=>{
                    if(err){
                        console.log(err)
                    }
                    if(result){
                        Transaction.updateOne({_id: result._id},{status: 'Success'},(err, update)=>{
                            if(update){
                                Account.findOne({username: req.session.uid}, (err, founded)=>{
                                    if(founded){
                                        var total = 0
                                        if(feeler == "Sender"){
                                            total = Number(founded.balance) - Number(amount) - fee
                                        }
                                        else{
                                            total = Number(founded.balance) - Number(amount)
                                        }
                                        Account.updateOne({username: req.session.uid}, {balance: total},(err, updateBalance)=>{
                                            if(updateBalance){
                                                User.findOne({phone: receiver},(err, user)=>{
                                                    if(user){
                                                        Account.findOne({email: user.email},(err, userAccount)=>{
                                                            if(userAccount){
                                                                var totalRecei = 0
                                                                if(feeler == "Receiver"){
                                                                    totalRecei = Number(amount) - fee
                                                                }
                                                                else{
                                                                    totalRecei = Number(amount)
                                                                }
                                                                Account.updateOne({email: userAccount.email},{balance: totalRecei},(err, received)=>{
                                                                    if(received){
                                                                        res.json({success: true, error: ""})
                                                                    }
                                                                })
                                                                
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                            else{
                                                return res.json({success: false, error: "Something happend, please reload website and try again"})
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
            else{
                res.json({success: false, error: "You don't have enough money to do this action"})
            }
        }
    })
}

module.exports = {
    getTransaction,
    getTransfer
}