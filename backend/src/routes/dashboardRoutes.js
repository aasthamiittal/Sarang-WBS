const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/get-daily-summary', auth, dashboardController.getDailySummary);
router.get('/get-stock-snapshot', auth, dashboardController.getStockSnapshot);
router.get('/get-alerts', auth, dashboardController.getAlerts);

module.exports = router;
