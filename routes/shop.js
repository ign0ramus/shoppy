const express = require('express');

const {
	handleGetHome,
	handleGetProducts,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
	handleGetProduct,
	handlePostCart,
	handleDeleteCartItem,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', handleGetHome);
router.get('/products', handleGetProducts);
router.get('/cart', handleGetCart);
router.post('/cart', handlePostCart);
router.get('/checkout', handleGetCheckout);
router.get('/orders', handleGetOrders);
router.get('/products/:id', handleGetProduct);
router.post('/cart-delete-item', handleDeleteCartItem);

module.exports = router;
