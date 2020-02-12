const ProductModel = require('../models/product');
const UserModel = require('../models/user');
const OrderModel = require('../models/order');

const handleGetHome = async (req, res) => {
	try {
		const products = await ProductModel.find();

		res.render('shop/index', {
			products: products,
			docTitle: 'All Products',
			path: '/',
			isAuthenticated: req.session.userId,
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
			isAuthenticated: req.session.userId,
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
			isAuthenticated: req.session.userId,
		});
	} catch (err) {
		console.error(err);
	}
};

const handleGetCart = async (req, res) => {
	try {
		const user = await UserModel.findById(req.session.userId);
		const cartProducts = await user.getCart();

		res.render('shop/cart', {
			path: '/cart',
			docTitle: 'Your Cart',
			products: cartProducts,
			isAuthenticated: req.session.userId,
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostCart = async (req, res) => {
	try {
		const { id } = req.body;
		const [product, user] = await Promise.all([
			ProductModel.findById(id),
			UserModel.findById(req.session.userId),
		]);

		await user.addToCart(product);

		res.redirect('/cart');
	} catch (err) {
		console.error(err);
	}
};

const handleDeleteCartItem = async (req, res) => {
	try {
		const { id } = req.body;
		const user = await UserModel.findById(req.session.userId);

		await user.removeItemFromCart(id);

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
		const orders = await OrderModel.find({ userId: req.session.userId });

		res.render('shop/orders', {
			path: '/orders',
			docTitle: 'Your Orders',
			orders,
			isAuthenticated: req.session.userId,
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostOrder = async (req, res) => {
	try {
		const user = await UserModel.findById(req.session.userId);
		const products = await user.getCart();
		await OrderModel.create({
			userId: req.session.userId,
			products,
		});
		await user.clearCart();

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
