const express = require('express');
const router = express.Router();

const visitorController = require('../controllers/visitor-controller');
const auth = require('../middleware/auth');


router.post('/', (req, res) => {
    res.send('router')
});

router.get('/get-evacuation-data', auth.auth, visitorController.EvacuationData);

router.get('/get-both-in-timeline', auth.auth, visitorController.meargeTimeLine);

router.get('/get-all-visitor/:startDate/:endDate', auth.auth, visitorController.getAllVisitor);

router.get('/get-pending-visitor/:startDate/:endDate', auth.auth, visitorController.getPendingVisitor);

router.get('/get-remembered-visitor', auth.auth, visitorController.getRememberedVisitor);

router.get('/get-all-ionic-visitor', auth.auth, visitorController.getAllVisitorIonic);

router.post('/get-today-visitor', auth.auth, visitorController.getTodayVisitor);

router.put('/approval-status/:id', auth.auth, visitorController.checkApproval);

router.post('/add-visitor', auth.auth, visitorController.addVisitor);

router.post('/add-terms/:id', auth.auth, visitorController.addTerms);

router.post('/employee-notify/:id', auth.auth, visitorController.notifyEmployee);

router.post('/notify-cafe/:id', auth.auth, visitorController.notifyCafe);

// router.post('/add-new-visitor', visitorController.addNewVisitor);

router.post('/add-visitors', auth.auth, visitorController.addVisitorByAdmin);

router.put('/edit-visitor/:id', auth.auth, visitorController.editVisitorByAdmin);

router.put('/anonymize-visitor-all', auth.auth, visitorController.anonymizeVisitorsByAdmin);

router.put('/visitors-logout', auth.auth, visitorController.multipleLogout);

router.put('/add-logout/:id', auth.auth, visitorController.addLogout);

router.put('/evacuationAll', auth.auth, visitorController.Evacuation);

router.put('/add-logout-all', auth.auth, visitorController.addLogoutAllVisitor);

router.get('/remaining-logout', auth.auth, visitorController.remainingLogout);

router.post('/remaining-logout-by-date', auth.auth, visitorController.remainingLogoutByDate);

router.delete('/delete-all-visitor', auth.auth, visitorController.deleteVisitors)

router.post('/add-visitor-in-device', auth.auth, visitorController.addVisitorInDevice)

router.get('/get-visitor-for-device/:id', auth.auth, visitorController.getVisitorForDevice)

router.put('/signin-visitor/:id', auth.auth, visitorController.signInVisitor)


module.exports = router;