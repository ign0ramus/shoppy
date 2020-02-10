const Product = require('../models/product');

const handleGetAddProduct = (req, res) => {
	res.render('add-product', {
		docTitle: 'Add Products',
		path: '/admin/add-product',
	});
};

const handlePostAddProduct = (req, res) => {
	const product = new Product(req.body.title);
	product.save();

	res.redirect('/');
};

const handleGetProducts = (req, res) => {
	Product.getAllProducts(products => {
		res.render('shop', {
			products,
			docTitle: 'My Shop',
			path: '/',
		});
	});
};

module.exports = {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
};
