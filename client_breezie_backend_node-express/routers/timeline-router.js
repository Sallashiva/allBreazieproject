const express = require('express');
const router = express.Router();

const timelineController = require('../controllers/timeline-controller');
const auth = require('../middleware/auth');

router.post('/', (req, res) => {
    res.send('Timeline')
});

router.get('/get-employees-timeline/:startDate/:endDate', auth.auth, timelineController.getEmployeesTimeline);

// router.get('/get-employees-timeline', timelineController.getEmployeesTimeline);

module.exports = router;