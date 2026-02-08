const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-supplier', auth, enforceTenant, checkPermission('suppliers', 'write'), supplierController.addSupplier);
router.get('/get-suppliers', auth, enforceTenant, checkPermission('suppliers', 'read'), supplierController.getSuppliers);
router.put('/update-supplier/:id', auth, enforceTenant, checkPermission('suppliers', 'write'), supplierController.updateSupplier);
router.delete('/delete-supplier/:id', auth, enforceTenant, checkPermission('suppliers', 'write'), supplierController.deleteSupplier);

module.exports = router;
