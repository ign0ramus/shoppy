const express = require('express');

const {
	handleGetHome,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
	handleGetProduct,
	handlePostCart,
	handleDeleteCartItem,
	handleGetCheckoutSuccess,
	handleGetOrderInvoice,
	handleGetCheckoutCancel,
} = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/', handleGetHome);
router.get('/cart', isAuth, handleGetCart);
router.post('/cart', isAuth, handlePostCart);
router.get('/checkout', isAuth, handleGetCheckout);
router.get('/checkout/success', isAuth, handleGetCheckoutSuccess);
router.get('/checkout/cancel', isAuth, handleGetCheckoutCancel);
router.get('/orders', isAuth, handleGetOrders);
router.get('/products/:id', handleGetProduct);
router.post('/cart-delete-item', isAuth, handleDeleteCartItem);
router.get('/orders/:orderId', isAuth, handleGetOrderInvoice);

module.exports = router;
