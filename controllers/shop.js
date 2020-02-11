const ProductModel = require('../models/product');
const OrderModel = require('../models/order');

const handleGetHome = async (req, res) => {
	try {
		const products = await ProductModel.find();

		res.render('shop/index', {
			products: products,
			docTitle: 'All Products',
			path: '/',
		});
	} catch (err) {
		console.error(err);
	}
};

const handleGetProducts = async (req, res) => {
	try {
		const products = await ProductModel.find();

		res.render('shop/products', {
			products,
			docTitle: 'All Products',
			path: '/products',
		});
	} catch (err) {
		console.error(err);
	}
};

const handleGetProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await ProductModel.findById(id);

		if (!product) {
			return res.redirect('/not-found');
		}

		res.render('shop/product-detail', {
			path: '/products',
			docTitle: product.title,
			product,
		});
	} catch (err) {
		console.error(err);
	}
};

const handleGetCart = async (req, res) => {
	try {
		const cartProducts = await req.user.getCart();

		res.render('shop/cart', {
			path: '/cart',
			docTitle: 'Your Cart',
			products: cartProducts,
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostCart = async (req, res) => {
	try {
		const { id } = req.body;
		const product = await ProductModel.findById(id);
		await req.user.addToCart(product);

		res.redirect('/cart');
	} catch (err) {
		console.error(err);
	}
};

const handleDeleteCartItem = async (req, res) => {
	try {
		const { id } = req.body;
		await req.user.removeItemFromCart(id);

		res.redirect('/cart');
	} catch (err) {
		console.error(err);
	}
};

const handleGetCheckout = (req, res) => {
	// res.render('shop/chekcout', {
	// 	path: '/chekcout',
	// 	docTitle: 'Checkout',
	// });
};

const handleGetOrders = async (req, res) => {
	try {
		const orders = await OrderModel.find({ userId: req.user });

		res.render('shop/orders', {
			path: '/orders',
			docTitle: 'Your Orders',
			orders,
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostOrder = async (req, res) => {
	try {
		const products = await req.user.getCart();
		await OrderModel.create({
			userId: req.user,
			products,
		});
		await req.user.clearCart();

		res.redirect('/orders');
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
	handleGetProducts,
	handleGetHome,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
	handleGetProduct,
	handlePostCart,
	handleDeleteCartItem,
	handlePostOrder,
};
