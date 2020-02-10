const Product = require('../models/product');

const handleGetHome = (req, res) => {
	Product.getAllProducts(products => {
		res.render('shop/index', {
			products,
			docTitle: 'Shop',
			path: '/',
		});
	});
};

const handleGetProducts = (req, res) => {
	Product.getAllProducts(products => {
		res.render('shop/products', {
			products,
			docTitle: 'All Products',
			path: '/products',
		});
	});
};

const handleGetCart = (req, res) => {
	res.render('shop/cart', {
		path: '/cart',
		docTitle: 'Your Cart',
	});
};

const handleGetCheckout = (req, res) => {
	res.render('shop/chekcout', {
		path: '/chekcout',
		docTitle: 'Checkout',
	});
};

const handleGetOrders = (req, res) => {
	res.render('shop/orders', {
		path: '/orders',
		docTitle: 'Your Orders',
	});
};

module.exports = {
	handleGetProducts,
	handleGetHome,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
};
