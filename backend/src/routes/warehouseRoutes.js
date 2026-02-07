const express = require('express');
const router = express.Router();
const warehouseController = require('../controllers/warehouseController');
const auth = require('../middleware/auth');

router.post('/add-warehouse', auth, warehouseController.addWarehouse);
router.get('/get-warehouses', auth, warehouseController.getWarehouses);
router.put('/update-warehouse/:id', auth, warehouseController.updateWarehouse);
router.delete('/delete-warehouse/:id', auth, warehouseController.deleteWarehouse);
router.get('/get-picking-list', auth, warehouseController.getPickingList);
router.post('/add-packing', auth, warehouseController.addPacking);
router.post('/add-dispatch', auth, warehouseController.addDispatch);
router.post('/add-bin', auth, warehouseController.addBin);
router.get('/get-bins', auth, warehouseController.getBins);
router.put('/update-bin/:id', auth, warehouseController.updateBin);
router.delete('/delete-bin/:id', auth, warehouseController.deleteBin);
router.post('/transfer-stock', auth, warehouseController.transferStock);

module.exports = router;
