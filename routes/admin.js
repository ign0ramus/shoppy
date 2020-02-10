const express = require('express');
const {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
} = require('../controllers/admin');

const router = express.Router();

router.get('/add-product', handleGetAddProduct);
router.get('/products', handleGetProducts);

router.post('/add-product', handlePostAddProduct);

module.exports = router;
