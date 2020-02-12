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
	handlePostOrder,
} = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', handleGetHome);
router.get('/products', handleGetProducts);
router.get('/cart', isAuth, handleGetCart);
router.post('/cart', isAuth, handlePostCart);
router.get('/checkout', isAuth, handleGetCheckout);
router.get('/orders', isAuth, handleGetOrders);
router.post('/create-order', isAuth, handlePostOrder);
router.get('/products/:id', handleGetProduct);
router.post('/cart-delete-item', isAuth, handleDeleteCartItem);

module.exports = router;
