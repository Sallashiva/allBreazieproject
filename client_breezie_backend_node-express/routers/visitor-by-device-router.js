const express = require('express');
const router = express.Router();

const visitorController = require('../controllers/visitor-by-device-controller');
const auth = require('../middleware/auth');

router.post('/', (req, res) => {
    res.send('router')
});

router.post('/add-visitor-in-device', auth.auth, visitorController.addVisitorWithoutImage)

router.post('/add-visitorwIthimage', auth.auth, visitorController.addVisitorWithImage)

router.post('/add-addVisitingWithEmail', auth.auth, visitorController.addVisitingWithEmail)

router.post('/add-addPhotoWithEmail', auth.auth, visitorController.addPhotoWithEmail) //add visiting with email without camera

router.post('/add-addVisitingWithPhoto', auth.auth, visitorController.addVisitingWithPhoto)

router.post('/add-addVisitingOnly', auth.auth, visitorController.addVisitingOnly)

router.post('/add-addEmailOnly', auth.auth, visitorController.addEmailOnly)

router.post('/add-addPhotoOnly', auth.auth, visitorController.addPhotoOnly)

router.post('/add-addVisitorDataOnly', auth.auth, visitorController.addVisitorDataOnly)

module.exports = router;