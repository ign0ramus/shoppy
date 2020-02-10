const express = require('express');

const {
	handleGetHome,
	handleGetProducts,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', handleGetHome);
router.get('/products', handleGetProducts);
router.get('/cart', handleGetCart);
router.get('/checkout', handleGetCheckout);
router.get('/orders', handleGetOrders);

module.exports = router;
