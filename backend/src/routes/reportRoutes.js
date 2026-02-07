const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');

router.get('/inventory-report', auth, reportController.inventoryReport);
router.get('/stock-purchase-report', auth, reportController.stockPurchaseReport);
router.get('/stock-sales-report', auth, reportController.stockSalesReport);
router.get('/order-dispatch-report', auth, reportController.orderDispatchReport);
router.get('/customer-report', auth, reportController.customerReport);
router.get('/returns-rto-report', auth, reportController.returnsRtoReport);
router.get('/warehouse-performance-report', auth, reportController.warehousePerformanceReport);

module.exports = router;
