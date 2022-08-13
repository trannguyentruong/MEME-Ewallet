var express = require('express');
var router = express.Router();
const {validationResult} = require('express-validator')
const {registerValidator, loginValidator} = require('../middlewares/validator')
const transactionAPI = require('../apis/transaction/transaction.api')

router.post('/api/:type', transactionAPI.getTransaction)

router.post('/api/transfer', transactionAPI.getTransfer)

module.exports = router;