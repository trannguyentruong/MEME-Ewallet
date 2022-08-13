var express = require('express');
var router = express.Router();
const checkRoleAdmin = require('../middlewares/checkRoleAdmin')
const adminAPI = require('../apis/admin/admin.api')

//Get admin dashboard
router.get('/',checkRoleAdmin, (req, res)=>{
    res.render('admin-user', { title: 'Admin', layout: './layouts/admin', address: 'user' });
})

router.get('/transaction', checkRoleAdmin, (req, res)=>{
    res.render('admin-transaction', { title: 'Admin', layout: './layouts/admin', address: 'transaction' })
})

router.get('/transactions', checkRoleAdmin, adminAPI.getTransactions)

//Get list account in admin-user page
router.get('/accounts', checkRoleAdmin, adminAPI.getAccounts)

//Get list account by status
router.get('/accounts/:stt', checkRoleAdmin, adminAPI.getAccountsByStt)

router.get('/transactions/:stt', checkRoleAdmin, adminAPI.getTransactionsByStt)

router.get('/transaction/:id', checkRoleAdmin, adminAPI.getTransactionDetail)

router.get('/account/user/:id', checkRoleAdmin, adminAPI.getAccountUserInfo)

router.get('/account/:email/:status', checkRoleAdmin, adminAPI.updateAccountStatus)

module.exports = router