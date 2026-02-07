const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');

router.post('/add-product', auth, productController.addProduct);
router.get('/get-products', auth, productController.getProducts);
router.get('/get-product/:id', auth, productController.getProduct);
router.put('/update-product/:id', auth, productController.updateProduct);
router.delete('/delete-product/:id', auth, productController.deleteProduct);

module.exports = router;
