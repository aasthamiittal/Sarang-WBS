const express = require('express');
const router = express.Router();
const returnController = require('../controllers/returnController');
const auth = require('../middleware/auth');

router.post('/add-return', auth, returnController.addReturn);
router.get('/get-returns', auth, returnController.getReturns);
router.post('/add-quality-check', auth, returnController.addQualityCheck);
router.post('/restock-item', auth, returnController.restockItem);
router.get('/get-rto-orders', auth, returnController.getRtoOrders);

module.exports = router;
