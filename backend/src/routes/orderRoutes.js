const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-order', auth, enforceTenant, checkPermission('orders', 'write'), orderController.addOrder);
router.get('/get-orders', auth, enforceTenant, checkPermission('orders', 'read'), orderController.getOrders);
router.get('/get-order/:id', auth, enforceTenant, checkPermission('orders', 'read'), orderController.getOrder);
router.put('/update-order-status/:id', auth, enforceTenant, checkPermission('orders', 'write'), orderController.updateOrderStatus);
router.get('/get-backorders', auth, enforceTenant, checkPermission('orders', 'read'), orderController.getBackorders);
router.get('/get-cancelled-orders', auth, enforceTenant, checkPermission('orders', 'read'), orderController.getCancelledOrders);

module.exports = router;
