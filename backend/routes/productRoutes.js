const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.post('/upload', productController.uploadProduct);
router.get('/products', productController.getProducts);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
