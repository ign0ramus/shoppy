const Product = require('../models/product');

const handleGetAddProduct = (req, res) => {
	res.render('admin/add-or-edit-product', {
		docTitle: 'Add Products',
		path: '/admin/add-product',
		product: null,
	});
};

const handlePostAddProduct = (req, res) => {
	const { title, imageUrl, description, price } = req.body;

	const product = new Product(title, imageUrl, description, price);
	product.save();

	res.redirect('/');
};

const handleGetEditProduct = (req, res) => {
	const { id } = req.params;

	Product.findById(id, product => {
		if (!product) {
			return res.redirect('/not-found');
		}

		res.render('admin/add-or-edit-product', {
			docTitle: 'Edit Products',
			path: '',
			product,
		});
	});
};

const handlePostEditProduct = (req, res) => {
	Product.edit(req.body);
	res.redirect('/admin/products');
};

const handleGetProducts = (req, res) => {
	Product.getAllProducts(products => {
		res.render('admin/products', {
			products,
			docTitle: 'Admin Products',
			path: '/admin/products',
		});
	});
};

const handleDeleteProduct = (req, res) => {
	const { id } = req.body;
	Product.delete(id, () => {
		res.redirect('/admin/products');
	});
};

module.exports = {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
	handleGetEditProduct,
	handlePostEditProduct,
	handleDeleteProduct,
};
