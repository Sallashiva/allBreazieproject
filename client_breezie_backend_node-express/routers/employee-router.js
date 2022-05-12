const express = require('express');
const router = express.Router();

const employeeController = require('../controllers/employee-controller');

const auth = require('../middleware/auth');
const storage = require("../helper/Storage");

router.post('/', (req, res) => {
    res.send('employee')
});

router.get('/get-employee/:id', auth.auth, employeeController.getEmployee);

router.get('/get-all-employee', auth.auth, employeeController.getAllEmployee);

router.get('/get-archived-employee/:startDate/:endDate', auth.auth, employeeController.getArchivedEmployee);

router.get('/get-deliverd-employee', auth.auth, employeeController.getEmployeeDeliveryPerson);

router.get('/get-all-admin', auth.auth, employeeController.getAllAdminInEmployee);

router.post('/add-employee', storage, auth.auth, employeeController.addEmployee);

router.post('/upload-employee-csv', auth.auth, employeeController.uploadCSV);

router.put('/edit-employee/:id', storage, auth.auth, employeeController.editEmployee);

router.delete('/delete-employee/:id', auth.auth, employeeController.deleteEmployee);

router.post('/change-status', auth.auth, employeeController.changeStatus);

router.put('/anonymize-employee', auth.auth, employeeController.anonymizedEmployee);

router.put('/archive-employee', auth.auth, employeeController.archiveEmployee);

router.put('/restore-archive-employee/:id', auth.auth, employeeController.restoreArchiveEmployee);

router.post('/make-admin/:id', auth.auth, employeeController.makeEmployeeAsAdmin);

router.post('/remove-admin/:id', auth.auth, employeeController.removeAdmin);


//deliverd-person
router.put('/make-deliverd-employee/:id', auth.auth, employeeController.makeDeliveredEmployee);

router.put('/remove-deliverd-employee/:id', auth.auth, employeeController.removeDeliveredEmployee);

//catering
router.get('/get-catering-employee', auth.auth, employeeController.getEmployeeCateringPerson);

router.get('/get-catering-added-employee', auth.auth, employeeController.getCateringAdded);

router.put('/make-catering-employee/:id', auth.auth, employeeController.makeCateringEmployee);

router.put('/remove-catering-employee/:id', auth.auth, employeeController.removeCateringEmployee);

//invite

router.post('/send-invite/:id', auth.auth, employeeController.sendInvite);

router.put('/set-password', employeeController.setEmployeePassword);


module.exports = router;