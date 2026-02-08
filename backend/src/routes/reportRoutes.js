const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.get('/inventory-report', auth, enforceTenant, checkPermission('inventory_report', 'view'), reportController.inventoryReport);
router.get('/stock-purchase-report', auth, enforceTenant, checkPermission('stock_report', 'view'), reportController.stockPurchaseReport);
router.get('/stock-sales-report', auth, enforceTenant, checkPermission('stock_report', 'view'), reportController.stockSalesReport);
router.get('/order-dispatch-report', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.orderDispatchReport);
router.get('/customer-report', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.customerReport);
router.get('/returns-rto-report', auth, enforceTenant, checkPermission('returns_report', 'view'), reportController.returnsRtoReport);
router.get('/warehouse-performance-report', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.warehousePerformanceReport);

router.post('/request-job', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.requestReportJob);
router.get('/jobs', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.getReportJobs);
router.get('/job/:id', auth, enforceTenant, checkPermission('order_report', 'view'), reportController.getReportJob);
router.get('/job/:id/download', auth, enforceTenant, reportController.downloadReportJob);

module.exports = router;
