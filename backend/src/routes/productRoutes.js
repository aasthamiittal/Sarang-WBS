const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const enforceTenant = require('../middleware/enforceTenant');
const { checkPermission } = require('../middleware/permission');

router.post('/add-product', auth, enforceTenant, checkPermission('products', 'write'), productController.addProduct);
router.get('/get-products', auth, enforceTenant, checkPermission('products', 'read'), productController.getProducts);
router.get('/get-product/:id', auth, enforceTenant, checkPermission('products', 'read'), productController.getProduct);
router.put('/update-product/:id', auth, enforceTenant, checkPermission('products', 'write'), productController.updateProduct);
router.delete('/delete-product/:id', auth, enforceTenant, checkPermission('products', 'write'), productController.deleteProduct);

module.exports = router;
