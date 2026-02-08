const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-warehouse', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.addWarehouse);
router.get('/get-warehouses', auth, enforceTenant, checkPermission('warehouses', 'read'), warehouseController.getWarehouses);
router.put('/update-warehouse/:id', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.updateWarehouse);
router.delete('/delete-warehouse/:id', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.deleteWarehouse);
router.get('/get-picking-list', auth, enforceTenant, checkPermission('warehouses', 'read'), warehouseController.getPickingList);
router.post('/add-packing', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.addPacking);
router.post('/add-dispatch', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.addDispatch);
router.post('/add-bin', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.addBin);
router.get('/get-bins', auth, enforceTenant, checkPermission('warehouses', 'read'), warehouseController.getBins);
router.put('/update-bin/:id', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.updateBin);
router.delete('/delete-bin/:id', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.deleteBin);
router.post('/transfer-stock', auth, enforceTenant, checkPermission('warehouses', 'write'), warehouseController.transferStock);

module.exports = router;
