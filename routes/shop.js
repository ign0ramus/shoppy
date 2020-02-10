const express = require('express');

const { products } = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('shop', {
		products,
		docTitle: 'My Shop',
		path: '/',
	});
});

module.exports = router;
