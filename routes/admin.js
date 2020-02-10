const express = require('express');
const {
	handleGetAddProduct,
	handlePostAddProduct,
} = require('../controllers/products');

const router = express.Router();

router.get('/add-product', handleGetAddProduct);
router.post('/add-product', handlePostAddProduct);

module.exports = router;
