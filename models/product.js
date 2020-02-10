const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

class Product {
	constructor(title, imageUrl, description, price) {
		this.id = Math.random().toString();
		this.title = title;
		this.imageUrl = imageUrl;
		this.description = description;
		this.price = price;
	}

	static filePath = path.join(rootDir, 'data', 'products.json');

	static getAllProducts(cb) {
		Product.getProductsFromFile(cb);
	}

	static getProductsFromFile(cb) {
		fs.readFile(Product.filePath, (err, data) => {
			if (err) {
				return cb([]);
			}
			cb(JSON.parse(data));
		});
	}

	static findById(id, cb) {
		Product.getProductsFromFile(products => {
			const product = products.find(prod => prod.id === id);
			cb(product);
		});
	}

	static edit(updates) {
		Product.getProductsFromFile(products => {
			const updateProdIdx = products.findIndex(prod => prod.id === updates.id);
			products[updateProdIdx] = { ...updates };
			fs.writeFile(Product.filePath, JSON.stringify(products), err => {
				console.error(err);
			});
		});
	}

	static delete(id, cb) {
		Product.getProductsFromFile(products => {
			const updatedProducts = products.filter(prod => prod.id !== id);
			fs.writeFile(Product.filePath, JSON.stringify(updatedProducts), err => {
				console.error(err);
			});
			cb();
		});
	}

	save() {
		Product.getProductsFromFile(products => {
			products.push(this);
			fs.writeFile(Product.filePath, JSON.stringify(products), err => {
				console.error(err);
			});
		});
	}
}

module.exports = Product;
