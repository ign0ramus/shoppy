const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const ProductModel = require('../models/product');
const UserModel = require('../models/user');
const OrderModel = require('../models/order');

const handleGetHome = async (req, res, next) => {
	try {
		const products = await ProductModel.find();

		res.render('shop/index', {
			products: products,
			docTitle: 'All Products',
			path: '/',
		});
	} catch (err) {
		next(err);
	}
};

const handleGetProducts = async (req, res, next) => {
	try {
		const products = await ProductModel.find();

		res.render('shop/products', {
			products,
			docTitle: 'All Products',
			path: '/products',
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

const handleGetCheckout = (req, res, next) => {
	// res.render('shop/chekcout', {
	// 	path: '/chekcout',
	// 	docTitle: 'Checkout',
	// });
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

const handlePostOrder = async (req, res, next) => {
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
	handleGetProducts,
	handleGetHome,
	handleGetCart,
	handleGetCheckout,
	handleGetOrders,
	handleGetProduct,
	handlePostCart,
	handleDeleteCartItem,
	handlePostOrder,
	handleGetOrderInvoice,
};
