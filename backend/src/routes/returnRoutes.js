const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-return', auth, enforceTenant, checkPermission('returns', 'write'), returnController.addReturn);
router.get('/get-returns', auth, enforceTenant, checkPermission('returns', 'read'), returnController.getReturns);
router.post('/add-quality-check', auth, enforceTenant, checkPermission('returns', 'write'), returnController.addQualityCheck);
router.post('/restock-item', auth, enforceTenant, checkPermission('returns', 'write'), returnController.restockItem);
router.get('/get-rto-orders', auth, enforceTenant, checkPermission('returns', 'read'), returnController.getRtoOrders);

module.exports = router;
