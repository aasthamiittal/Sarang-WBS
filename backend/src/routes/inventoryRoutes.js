const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-stock-inward', auth, enforceTenant, checkPermission('inventory', 'write'), inventoryController.addStockInward);
router.get('/get-current-stock', auth, enforceTenant, checkPermission('inventory', 'read'), inventoryController.getCurrentStock);
router.get('/get-stock-movement', auth, enforceTenant, checkPermission('inventory', 'read'), inventoryController.getStockMovement);
router.post('/add-stock-adjustment', auth, enforceTenant, checkPermission('inventory', 'write'), inventoryController.addStockAdjustment);
router.get('/get-low-stock', auth, enforceTenant, checkPermission('inventory', 'read'), inventoryController.getLowStock);

module.exports = router;
