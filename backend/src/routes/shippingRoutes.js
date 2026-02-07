const express = require('express');
const router = express.Router();
const shippingController = require('../controllers/shippingController');
const auth = require('../middleware/auth');

router.post('/select-courier', auth, shippingController.selectCourier);
router.post('/generate-label', auth, shippingController.generateLabel);
router.get('/track-shipment', auth, shippingController.trackShipment);
router.put('/update-delivery-status', auth, shippingController.updateDeliveryStatus);

module.exports = router;
