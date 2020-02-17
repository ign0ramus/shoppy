const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

const ProductModel = require('../database/models/product');
const UserModel = require('../database/models/user');
const OrderModel = require('../database/models/order');

const ITEMS_PER_PAGE = 6;

const handleGetHome = async (req, res, next) => {
	try {
		const page = req.query.page || 1;

		const [products, total] = await Promise.all([
			ProductModel.find()
				.skip((page - 1) * ITEMS_PER_PAGE)
				.limit(ITEMS_PER_PAGE),
			ProductModel.countDocuments(),
		]);
		res.render('shop/index', {
			products: products,
			userId: req.session.userId,
			docTitle: 'All Products',
			path: '/',
			page,
			hasNextPage: ITEMS_PER_PAGE * page < total,
			hasPrevPage: page > 1,
			nextPage: +page + 1,
			prevPage: page - 1,
			lastPage: Math.ceil(total / ITEMS_PER_PAGE),
		});
	} catch (err) {
		next(err);
	}
};

const handleGetProduct = async (req, res, next) => {
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
		next(err);
	}
};

const handleGetCart = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.session.userId);
		const cartProducts = await user.getCart();

		res.render('shop/cart', {
			path: '/cart',
			docTitle: 'Your Cart',
			products: cartProducts,
		});
	} catch (err) {
		next(err);
	}
};

const handlePostCart = async (req, res, next) => {
	try {
		const { id } = req.body;
		const [product, user] = await Promise.all([
			ProductModel.findById(id),
			UserModel.findById(req.session.userId),
		]);

		await user.addToCart(product);

		res.redirect('/cart');
	} catch (err) {
		next(err);
	}
};

const handleDeleteCartItem = async (req, res, next) => {
	try {
		const { id } = req.body;
		const user = await UserModel.findById(req.session.userId);

		await user.removeItemFromCart(id);

		res.redirect('/cart');
	} catch (err) {
		next(err);
	}
};

const handleGetCheckout = async (req, res, next) => {
	try {
		const user = await UserModel.findById(req.session.userId);
		const cartProducts = await user.getCart();
		const total = cartProducts.reduce(
			(acc, prod) => acc + prod.price * prod.quantity,
			0
		);

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ['card'],
			line_items: cartProducts.map(prod => ({
				name: prod.title,
				description: prod.description,
				amount: prod.price * 100,
				currency: 'usd',
				quantity: prod.quantity,
			})),
			success_url: `${req.protocol}://${req.get('host')}/checkout/success`,
			cancel_url: `${req.protocol}://${req.get('host')}/checkout/cancel`,
		});
		const [error] = req.flash('error');
		res.render('shop/checkout', {
			path: '/checkout',
			docTitle: 'Your Cart',
			products: cartProducts,
			total,
			sessionId: session.id,
			error,
		});
	} catch (err) {
		next(err);
	}
};

const handleGetCheckoutCancel = (req, res) => {
	req.flash('error', 'Error occured. Checkout process canceled');
	return res.redirect('/checkout');
};

const handleGetOrders = async (req, res, next) => {
	try {
		const orders = await OrderModel.find({ userId: req.session.userId });

		res.render('shop/orders', {
			path: '/orders',
			docTitle: 'Your Orders',
			orders,
		});
	} catch (err) {
		next(err);
	}
};

const handleGetCheckoutSuccess = async (req, res, next) => {
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
		next(err);
	}
};

const handleGetOrderInvoice = async (req, res, next) => {
	const { orderId } = req.params;

	const order = await OrderModel.findOne({
		_id: orderId,
		userId: req.session.userId,
	});

	if (!order) {
		return res.redirect('/not-found');
	}

	const invoiceName = `invoice-${order.id}.pdf`;
	const invoicePath = path.join('data', invoiceName);

	res.setHeader('Content-Type', 'application/pdf');
	res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

	const pdfDoc = new PDFDocument();
	pdfDoc.pipe(fs.createWriteStream(invoicePath));
	pdfDoc.pipe(res);

	pdfDoc.fontSize(26).text('Invoice', { underline: true });
	pdfDoc.text('-------------------');
	order.products.forEach(prod => {
		pdfDoc
			.fontSize(16)
			.text(`${prod.title} - ${prod.quantity} x $${prod.price}`);
	});
	pdfDoc.text('-------------------');
	const totalPrice = order.products.reduce(
		(total, prod) => total + prod.quantity * prod.price,
		0
	);
	pdfDoc.fontSize(20).text(`Total: $${totalPrice}`);

	pdfDoc.end();
};

module.exports = {
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
};
