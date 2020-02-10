const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');

class Product {
	constructor(title, imageUrl, description, price) {
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
