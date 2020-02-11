const Product = require('../models/product');

const handleGetHome = async (req, res) => {
	try {
		const products = await Product.getAll();
		res.render('shop/index', {
			products,
			docTitle: 'All Products',
			path: '/',
		});
	} catch (err) {
		console.error(err);
	}
};

const handleGetProducts = async (req, res) => {
	try {
		const products = await Product.getAll();
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
		const product = await Product.getById(id);

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
		const { productId } = req.body;
		const product = await Product.getById(productId);
		await req.user.addToCart(product);

		res.redirect('/cart');
	} catch (err) {
		console.error(err);
	}
};

const handleDeleteCartItem = async (req, res) => {
	try {
		const { id } = req.body;
		await req.user.deleteItemFromCart(id);
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
		const orders = await req.user.getOrders();

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
		await req.user.addOrder();
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
