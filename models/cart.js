const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

class Cart {
	static filePath = path.join(rootDir, 'data', 'cart.json');

	static addProduct(id, price) {
		// fetch prev cart
		fs.readFile(Cart.filePath, (err, data) => {
			let cart = { products: [], totalPrice: 0 };

			if (!err) {
				cart = JSON.parse(data);
			}

			cart.totalPrice = cart.totalPrice + +price;

			// analyze cart => find product in cart
			const existProdIdx = cart.products.findIndex(prod => prod.id === id);
			const existProd = cart.products[existProdIdx];

			// add new product / increase quantity
			if (existProd) {
				cart.products[existProdIdx] = {
					...existProd,
					quantity: existProd.quantity + 1,
				};
			} else {
				cart.products.push({
					id,
					quantity: 1,
				});
			}
			fs.writeFile(Cart.filePath, JSON.stringify(cart), err => {
				console.error(err);
			});
		});
	}

	static delete(id, price) {
		fs.readFile(Cart.filePath, (err, data) => {
			if (err) {
				return;
			}

			const cart = JSON.parse(data);
			const product = cart.products.find(prod => prod.id === id);
			cart.totalPrice = cart.totalPrice - product.quantity * price;
			cart.products = cart.products.filter(prod => prod.id !== id);

			fs.writeFile(Cart.filePath, JSON.stringify(cart), err => {
				console.error(err);
			});
		});
	}

	static getCart(cb) {
		fs.readFile(Cart.filePath, (err, data) => {
			if (err) {
				console.log(err)
				return cb(null);
			}
			cb(JSON.parse(data));
		});
	}
}

module.exports = Cart;
