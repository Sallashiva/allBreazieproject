const express = require('express');
const router = express.Router();

const adminController = require('../controllers/login-controller');

router.get('/get-all-users', adminController.getAllUsers);

router.get('/check-users/:id', adminController.checkUsers);

router.post('/register', adminController.register);

router.post('/login', adminController.login);

router.put('/edit-user/:id', adminController.editUser);

router.delete('/delete-users/:id', adminController.deleteUser);

router.post('/forgot-password', adminController.forgotPassword);

router.post('/check-otp', adminController.checkOtp);

router.put('/update-password', adminController.updatePassword);


module.exports = router;