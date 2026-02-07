const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/add-order', auth, orderController.addOrder);
router.get('/get-orders', auth, orderController.getOrders);
router.get('/get-order/:id', auth, orderController.getOrder);
router.put('/update-order-status/:id', auth, orderController.updateOrderStatus);
router.get('/get-backorders', auth, orderController.getBackorders);
router.get('/get-cancelled-orders', auth, orderController.getCancelledOrders);

module.exports = router;
