const express = require('express');
const {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
	handleGetEditProduct,
	handlePostEditProduct,
	handleDeleteProduct,
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', handleGetAddProduct);
router.post('/add-product', handlePostAddProduct);
router.get('/products', handleGetProducts);
router.get('/edit-product/:id', handleGetEditProduct);
router.post('/edit-product', handlePostEditProduct);
router.post('/delete-product', handleDeleteProduct);

module.exports = router;
