const express = require('express');
const router = express.Router();
const activityLogController = require('../controllers/activityLogController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const requireAdmin = require('../middleware/requireAdmin');

router.get('/get-activity-logs', auth, enforceTenant, requireAdmin, activityLogController.getActivityLogs);

module.exports = router;
