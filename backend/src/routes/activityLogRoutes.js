const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const auth = require('../middleware/auth');

router.get('/get-activity-logs', auth, activityLogController.getActivityLogs);

module.exports = router;
