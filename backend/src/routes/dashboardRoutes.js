const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.get('/get-daily-summary', auth, enforceTenant, checkPermission('dashboard', 'view'), dashboardController.getDailySummary);
router.get('/get-stock-snapshot', auth, enforceTenant, checkPermission('dashboard', 'view'), dashboardController.getStockSnapshot);
router.get('/get-alerts', auth, enforceTenant, checkPermission('dashboard', 'view'), dashboardController.getAlerts);

module.exports = router;
