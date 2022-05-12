const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const registerController = require('../controllers/register-controller');
const storage = require("../helper/Storage");

router.get('/', (req, res) => {
    res.send('register')
});

router.get('/get-all-registered-user', registerController.getAllRegisteredData);

router.get('/get-registered-user', registerController.getRegisteredData);

router.post('/register-new-user', registerController.registerNewUser);

router.put('/add-password', registerController.addPasswordAndDefaults);

router.post('/login', registerController.login);

router.post('/device-login', registerController.deviceLogin);

router.post('/device-logout', auth.auth, registerController.deviceLogOut);

router.post('/check-device', registerController.checkDevice);


module.exports = router;