const Product = require('../models/product');
const Cart = require('../models/cart');

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

const handleGetProduct = (req, res) => {
	const { id } = req.params;
	Product.findById(id, product => {
		if (!product) {
			return res.redirect('/not-found');
		}
		res.render('shop/product-detail', {
			path: '/products',
			docTitle: product.title,
			product,
		});
	});
};

const handleGetCart = (req, res) => {
	Cart.getCart(cart => {
		Product.getAllProducts(products => {
			const cartProducts = products.reduce((acc, prod) => {
				const product = cart.products.find(cartProd => cartProd.id === prod.id);
				return product
					? [...acc, { data: prod, quantity: product.quantity }]
					: acc;
			}, []);

			res.render('shop/cart', {
				path: '/cart',
				docTitle: 'Your Cart',
				products: cartProducts,
			});
		});
	});
};

const handlePostCart = (req, res) => {
	const { productId } = req.body;
	Product.findById(productId, product => {
		Cart.addProduct(productId, product.price);
		res.redirect('/cart');
	});
};

const handleDeleteCartItem = (req, res) => {
	const { id } = req.body;
	Product.findById(id, product => {
		Cart.delete(id, product.price);
		res.redirect('/cart');
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
	handleGetProduct,
	handlePostCart,
	handleDeleteCartItem,
};
