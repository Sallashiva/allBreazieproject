const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const accountController = require('../controllers/account-controller');

router.get('/', (req, res) => {
    res.send('Account')
});

router.get('/get-account-details',accountController.getAccountDetails);

// router.post('/add-plans',accountController.addplans)

router.get('/get-history',accountController.getHistory);

router.get('/get-payment-history',accountController.getPaymentHistory);

router.post('/add-payment-method/:id',accountController.addPaymentMethod);

router.put('/edit-payment-method/:id', accountController.editPaymentMethod);

router.put('/add-account-details', auth.auth,accountController.addAccountDetails);

router.put('/add-invoice-address', auth.auth,accountController.addInvoiceAddress);

// router.put('/edit-settings-account/:id', accountController.editSettingsAccount);


module.exports = router;
