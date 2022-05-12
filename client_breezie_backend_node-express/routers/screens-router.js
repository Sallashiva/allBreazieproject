const express = require('express');
const router = express.Router();

const screenController = require('../controllers/screens-controller');
const storage = require("../helper/Storage");
const auth = require('../middleware/auth');
router.get('/', (req, res) => {
    res.send('Screens')
});

router.post('/add-screens', storage, auth.auth, screenController.addImages);

router.get('/get-all-screens', auth.auth, screenController.getAllimages);

router.put('/select-screen/:id', auth.auth, screenController.selectScreen);

router.delete('/delete-screen/:id', auth.auth, screenController.deleteScreens);


module.exports = router;