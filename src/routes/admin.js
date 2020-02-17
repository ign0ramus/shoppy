const express = require('express');

const {
	handleGetAddProduct,
	handlePostAddProduct,
	handleGetProducts,
	handleGetEditProduct,
	handlePostEditProduct,
	handleDeleteProduct,
} = require('../controllers/admin');
const { addOrEditProductValidations } = require('../utils/validation/admin');
const isAuth = require('../middleware/isAuth');

const router = express.Router();

router.get('/add-product', isAuth, handleGetAddProduct);
router.post(
	'/add-product',
	addOrEditProductValidations,
	isAuth,
	handlePostAddProduct
);
router.get('/products', isAuth, handleGetProducts);
router.get('/edit-product/:id', isAuth, handleGetEditProduct);
router.post(
	'/edit-product',
	addOrEditProductValidations,
	isAuth,
	handlePostEditProduct
);
router.delete('/product/:id', isAuth, handleDeleteProduct);

module.exports = router;
