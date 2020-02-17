const { validationResult } = require('express-validator');

const ProductModel = require('../database/models/product');
const { deleteFile } = require('../utils/file');

const handleGetAddProduct = (req, res, next) => {
	res.render('admin/add-or-edit-product', {
		docTitle: 'Add Products',
		path: '/admin/add-product',
		product: null,
		error: null,
	});
};

const handlePostAddProduct = async (req, res, next) => {
	try {
		const { title, description, price } = req.body;
		const errors = validationResult(req).formatWith(({ msg }) => msg);
		const image = req.file;

		if (!errors.isEmpty() || req.fileTypeError) {
			return res.status(422).render('admin/add-or-edit-product', {
				docTitle: 'Add Products',
				path: '/admin/add-product',
				product: { title, price, description },
				error: req.fileTypeError || errors.array(),
			});
		}

		await ProductModel.create({
			title,
			imageUrl: image.path,
			price,
			description,
			userId: req.session.userId,
		});

		res.redirect('/');
	} catch (err) {
		next(err);
	}
};

const handleGetEditProduct = async (req, res, next) => {
	try {
		const { id } = req.params;
		const product = await ProductModel.findOne({
			_id: id,
			userId: req.session.userId,
		});

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
		next(err);
	}
};

const handlePostEditProduct = async (req, res, next) => {
	try {
		const { id, title, price, description } = req.body;
		const product = await ProductModel.findOne({
			_id: id,
			userId: req.session.userId,
		});

		if (!product) {
			res.status(401);
		}

		const errors = validationResult(req).formatWith(({ msg }) => msg);
		if (!errors.isEmpty() || req.fileTypeError) {
			return res.status(422).render('admin/add-or-edit-product', {
				docTitle: 'Edit Products',
				path: '/admin/edit-product',
				product: { id, title, price, description },
				error: req.fileTypeError || errors.array(),
			});
		}

		const image = req.file;
		const productData = { title, price, description };
		if (image) {
			if (product.imageUrl) {
				await deleteFile(product.imageUrl);
			}
			productData.imageUrl = image.path;
		}

		await product.updateOne(productData);

		res.redirect('/admin/products');
	} catch (err) {
		next(err);
	}
};

const handleGetProducts = async (req, res, next) => {
	try {
		const products = await ProductModel.find({ userId: req.session.userId });

		res.render('admin/products', {
			products,
			docTitle: 'Admin Products',
			path: '/admin/products',
		});
	} catch (err) {
		next(err);
	}
};

const handleDeleteProduct = async (req, res) => {
	try {
		const { id } = req.params;
		const product = await ProductModel.findOne({
			_id: id,
			userId: req.session.userId,
		});

		if (!product) {
			return res.status(401).send();
		}

		await Promise.all([deleteFile(product.imageUrl), product.deleteOne()]);

		res.json({ message: 'Success' });
	} catch (err) {
		res.status(500).send();
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
