const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-purchase-order', auth, enforceTenant, checkPermission('purchases', 'write'), purchaseController.addPurchaseOrder);
router.get('/get-purchase-orders', auth, enforceTenant, checkPermission('purchases', 'read'), purchaseController.getPurchaseOrders);
router.get('/get-forecast', auth, enforceTenant, checkPermission('purchases', 'read'), purchaseController.getForecast);
router.get('/get-reorder-levels', auth, enforceTenant, checkPermission('purchases', 'read'), purchaseController.getReorderLevels);

module.exports = router;
