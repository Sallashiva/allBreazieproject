const express = require('express');
const router = express.Router();

const agreementController = require('../controllers/agreement-controller');
const auth = require('../middleware/auth');
const storage = require("../helper/pdfStorage");


router.get('/', (req, res) => {
    res.send('Agreement')
});

router.get('/get-all-agreement', agreementController.getAllAgreement)

router.get('/get-agreement', agreementController.getCompanyAgreement)

router.post('/add-new-agreement', agreementController.addNewAgreement)

router.put('/edit-agreement/:id', agreementController.editAgreement)





module.exports = router;