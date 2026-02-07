const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');

router.post('/add-supplier', auth, supplierController.addSupplier);
router.get('/get-suppliers', auth, supplierController.getSuppliers);
router.put('/update-supplier/:id', auth, supplierController.updateSupplier);
router.delete('/delete-supplier/:id', auth, supplierController.deleteSupplier);

module.exports = router;
