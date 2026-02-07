const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

router.post('/add-stock-inward', auth, inventoryController.addStockInward);
router.get('/get-current-stock', auth, inventoryController.getCurrentStock);
router.get('/get-stock-movement', auth, inventoryController.getStockMovement);
router.post('/add-stock-adjustment', auth, inventoryController.addStockAdjustment);
router.get('/get-low-stock', auth, inventoryController.getLowStock);

module.exports = router;
