const express = require('express');
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
router.post('/add-product', isAuth, handlePostAddProduct);
router.get('/products', isAuth, handleGetProducts);
router.get('/edit-product/:id', isAuth, handleGetEditProduct);
router.post('/edit-product', isAuth, handlePostEditProduct);
router.post('/delete-product', isAuth, handleDeleteProduct);

module.exports = router;
