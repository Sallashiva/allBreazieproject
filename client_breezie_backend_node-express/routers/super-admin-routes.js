const express = require('express');
const router = express.Router();

const superAdminController = require('../controllers/super-admin-controller');
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send('Super Admin')
});

router.post('/register-super-admin', superAdminController.registerSuperAdmin);

router.post('/login-super-admin', superAdminController.loginSuperAdmin);

router.post('/super-admin-login', superAdminController.superAdminLogin);

router.post('/check-otp', superAdminController.checkOtp);

router.post('/resend-otp', superAdminController.resendOtp);

router.get('/get-dashboard-data', superAdminController.dashboardData);

router.post('/get-customer-data', superAdminController.customerData);

router.post('/get-revenue-data', superAdminController.revenueData);

router.post('/get-reminder-data', superAdminController.reminderData);

router.post('/send-reminder', superAdminController.sendReminder);

router.get('/get-country-data', superAdminController.getCountryData);

router.get('/get-package-type-data', superAdminController.getPackageType);

module.exports = router;