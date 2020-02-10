const Product = require('../models/product');

const handleGetAddProduct = (req, res) => {
	res.render('admin/add-product', {
		docTitle: 'Add Products',
		path: '/admin/add-product',
	});
};

const handlePostAddProduct = (req, res) => {
	const { title, imageUrl, description, price } = req.body;

	const product = new Product(title, imageUrl, description, price);
	product.save();

	res.redirect('/');
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

module.exports = {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
};
