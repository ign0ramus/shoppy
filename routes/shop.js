const express = require('express');

const { handleGetProducts } = require('../controllers/products');

const router = express.Router();

router.get('/', handleGetProducts);

module.exports = router;
