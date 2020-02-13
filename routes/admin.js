const express = require('express');
const { body, check } = require('express-validator');

const {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
	handleGetEditProduct,
	handlePostEditProduct,
	handleDeleteProduct,
} = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/add-product', isAuth, handleGetAddProduct);
router.post(
	'/add-product',
	[
		body('title', 'Title should be alphanumeric and minimum 3 characters')
			.isString()
			.isLength({ min: 3 })
			.trim(),
		body('price', 'Price should be floating number').isFloat(),
		check('file', 'Image is required').custom((value, { req }) =>
			Boolean(req.file)
		),
		body(
			'description',
			'Description length minimum 5 characters and maximum 400 characters'
		)
			.isLength({ min: 5, max: 400 })
			.trim(),
	],
	isAuth,
	handlePostAddProduct
);
router.get('/products', isAuth, handleGetProducts);
router.get('/edit-product/:id', isAuth, handleGetEditProduct);
router.post(
	'/edit-product',
	[
		body('title', 'Title should be alphanumeric and minimum 3 characters')
			.isString()
			.isLength({ min: 3 })
			.trim(),
		body('price', 'Price should be floating number').isFloat(),
		body(
			'description',
			'Description length minimum 5 characters and maximum 400 characters'
		)
			.isLength({ min: 5, max: 400 })
			.trim(),
	],
	isAuth,
	handlePostEditProduct
);
router.post('/delete-product', isAuth, handleDeleteProduct);

module.exports = router;
