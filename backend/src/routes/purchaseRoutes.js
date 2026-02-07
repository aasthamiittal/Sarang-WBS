const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchaseController');
const auth = require('../middleware/auth');

router.post('/add-purchase-order', auth, purchaseController.addPurchaseOrder);
router.get('/get-purchase-orders', auth, purchaseController.getPurchaseOrders);
router.get('/get-forecast', auth, purchaseController.getForecast);
router.get('/get-reorder-levels', auth, purchaseController.getReorderLevels);

module.exports = router;
