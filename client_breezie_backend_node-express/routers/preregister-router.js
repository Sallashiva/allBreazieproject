const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const preregisterController = require('../controllers/preregister-controller');

router.get('/', (req, res) => {
    res.send('Preregister')
});

router.post('/add-new-visitor', auth.auth, preregisterController.addNewVisitor)

router.get('/get-preregister-visitor', auth.auth, preregisterController.getPreregisterVisitor)

router.get('/remaining-preregister-logout', auth.auth, preregisterController.remainingPreregisterLogout)

router.get('/get-preregister-visitor/:id', auth.auth, preregisterController.getPreregisterVisitorById);

router.put('/edit-preregister/:id', auth.auth, preregisterController.editPreregisterData);

router.delete('/delete-preregister/:id', auth.auth, preregisterController.deletePreregister);




module.exports = router;