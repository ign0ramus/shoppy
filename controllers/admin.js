const { validationResult } = require('express-validator');

const ProductModel = require('../models/product');

const handleGetAddProduct = (req, res) => {
	res.render('admin/add-or-edit-product', {
		docTitle: 'Add Products',
		path: '/admin/add-product',
		product: null,
		error: null,
	});
};

const handlePostAddProduct = async (req, res) => {
	try {
		const { title, imageUrl, description, price } = req.body;

		const errors = validationResult(req).formatWith(({ msg }) => msg);
		if (!errors.isEmpty()) {
			return res.status(422).render('admin/add-or-edit-product', {
				docTitle: 'Add Products',
				path: '/admin/add-product',
				product: { title, imageUrl, price, description },
				error: errors.array(),
			});
		}

		await ProductModel.create({
			title,
			imageUrl,
			price,
			description,
			userId: req.session.userId,
		});

		res.redirect('/');
	} catch (err) {
		console.error(err);
	}
};

const handleGetEditProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await ProductModel.findById(id);

		if (!product) {
			return res.redirect('/not-found');
		}

		res.render('admin/add-or-edit-product', {
			docTitle: 'Edit Products',
			path: '/admin/edit-product',
			product,
			error: null,
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostEditProduct = async (req, res) => {
	try {
		const { id, title, imageUrl, price, description } = req.body;
		const errors = validationResult(req).formatWith(({ msg }) => msg);
		if (!errors.isEmpty()) {
			return res.status(422).render('admin/add-or-edit-product', {
				docTitle: 'Edit Products',
				path: '/admin/edit-product',
				product: { title, imageUrl, price, description },
				error: errors.array(),
			});
		}

		await ProductModel.findOneAndUpdate(
			{ _id: id, userId: req.session.userId },
			{ title, imageUrl, price, description }
		);

		res.redirect('/admin/products');
	} catch (err) {
		console.error(err);
	}
};

const handleGetProducts = async (req, res) => {
	try {
		const products = await ProductModel.find({ userId: req.session.userId });

		res.render('admin/products', {
			products,
			docTitle: 'Admin Products',
			path: '/admin/products',
		});
	} catch (err) {
		console.error(err);
	}
};

const handleDeleteProduct = async (req, res) => {
	try {
		const { id } = req.body;
		await ProductModel.findOneAndDelete({
			_id: id,
			userId: req.session.userId,
		});

		res.redirect('/admin/products');
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
	handleGetEditProduct,
	handlePostEditProduct,
	handleDeleteProduct,
};
