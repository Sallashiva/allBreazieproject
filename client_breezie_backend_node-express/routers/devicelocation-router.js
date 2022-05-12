const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const deviceLocationController = require('../controllers/devicelocation-controller');


router.get('/', (req, res) => {
    res.send('Devicelocation')
});


router.get('/get-all-devices', auth.auth, deviceLocationController.getAllDevices)

router.get('/get-company-device-data', auth.auth, deviceLocationController.getCompanyDevicesData);

router.get('/get-device-data', auth.auth, deviceLocationController.getCompanyDevicesDataForDevice);

router.put('/edit-location/:id', auth.auth, deviceLocationController.editLocation)

router.delete('/delete-location/:id', auth.auth, deviceLocationController.removeLocation);

router.get('/get-company-locations', auth.auth, deviceLocationController.getCompanyLocations)

router.post('/add-new-location', auth.auth, deviceLocationController.addNewLocation);

router.put('/reset-device-identifier/:id', auth.auth, deviceLocationController.resetDeviceIdentifier);

router.put('/edit-device-setting/:id', auth.auth, deviceLocationController.changeDeviceSetting);

module.exports = router;