const express = require('express');
const router = express.Router();

const settingController = require('../controllers/settings-controller');
const {
    storage,
    storage1,
    cateringStorage
} = require("../helper/imageStorage");
const auth = require('../middleware/auth');

router.get('/', (req, res) => {
    res.send('Settings')
});

// router.post('/add-default-setting/:id',auth.auth, settingController.addDefaultSetting)

router.get('/get-all-settings', auth.auth, settingController.getAllSettings);

router.get('/get-company-settings', auth.auth, settingController.getCompanySettings)

router.post('/catering-free-trial', auth.auth, settingController.freeTrial)

// router.post('/add-brand-logo/:id',storage, auth.auth, settingController.addBrandLogo);

// router.post('/add-brand-colour', auth.auth, settingController.addBrandColour);

router.put('/edit-brand-logo/:id', storage, auth.auth, settingController.editBrandLogo);

router.put('/edit-brand-colour', auth.auth, settingController.editBrandColor);

router.put('/edit-remember-visitor', auth.auth, settingController.editVisitorSetting);

router.put('/edit-id-badge', auth.auth, settingController.editIdBadge);

router.put('/edit-contact-less', settingController.editContactLess);

router.put('/edit-employee-setting', auth.auth, settingController.editEmployeeSetting);

router.put('/add-employee-signout-questions', auth.auth, settingController.addEmployeeSignoutQuestions);

router.put('/edit-emplouyee-signout-questions', auth.auth, settingController.editEmployeeSignoutQuestions);

router.delete('/delete-emplouyee-signout-questions', auth.auth, settingController.deleteEmployeeSignoutQuestions);

router.put('/edit-welcom-screen', auth.auth, settingController.editWelcomeScreen);

router.put('/brand-selected/:id', auth.auth, settingController.brandSelected);


router.put('/edit-visitor-field', auth.auth, settingController.editVisitorFields);

router.put('/edit-delivery-setup', auth.auth, settingController.deliverySetup);

router.put('/edit-delivery-instructions', auth.auth, settingController.deliveryInstructions);

// router.put('/edit-catering-menu', cateringStorage, auth.auth, settingController.cateringMenu);

router.post('/edit-screen-image', storage1, auth.auth, settingController.addImages);

router.get('/get-screen-image', auth.auth, settingController.getImage);

router.put('/update-screen-image/:id', auth.auth, settingController.upadteImage);

router.put('/selected-screen-image/:id', auth.auth, settingController.selected);

router.delete('/remove-image/:id', auth.auth, settingController.deleteImage);



//branding
router.post('/add-brand-logo', storage, settingController.addCompanyLogo);

router.get('/get-brand-logo', settingController.getCompanyLogo);

router.delete('/delete-brand-logo/:id', settingController.deleteCompanyLogo);

module.exports = router;