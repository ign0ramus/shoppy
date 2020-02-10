const express = require('express');

const {
	handleGetHome,
	handleGetProducts,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
	handleGetProduct,
	handlePostCart,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', handleGetHome);
router.get('/products', handleGetProducts);
router.get('/cart', handleGetCart);
router.post('/cart', handlePostCart);
router.get('/checkout', handleGetCheckout);
router.get('/orders', handleGetOrders);
router.get('/products/:id', handleGetProduct);

module.exports = router;
