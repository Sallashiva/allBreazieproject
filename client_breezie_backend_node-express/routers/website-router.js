const express = require('express');
const router = express.Router();

const websiteController = require('../controllers/website-controller');

router.post('/send-contact-mail', websiteController.contacts);
module.exports = router;