const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/select-courier', auth, enforceTenant, checkPermission('shipping', 'write'), shippingController.selectCourier);
router.post('/generate-label', auth, enforceTenant, checkPermission('shipping', 'write'), shippingController.generateLabel);
router.get('/track-shipment', auth, enforceTenant, checkPermission('shipping', 'read'), shippingController.trackShipment);
router.put('/update-delivery-status', auth, enforceTenant, checkPermission('shipping', 'write'), shippingController.updateDeliveryStatus);

module.exports = router;
