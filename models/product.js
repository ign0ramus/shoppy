const mongoDb = require('mongodb');
const { getDb } = require('../database/mongodb');

class Product {
	constructor(title, imageUrl, price, description, id, userId) {
		this.title = title;
		this.imageUrl = imageUrl;
		this.price = price;
		this.description = description;
		this._id = id ? new mongoDb.ObjectID(id) : null;
		this.userId = userId;
	}

	async save() {
		const db = getDb();
		try {
			if (this._id) {
				return await db
					.collection('products')
					.updateOne({ _id: this._id }, { $set: this });
			}
			return await db.collection('products').insertOne(this);
		} catch (err) {
			console.error(err);
		}
	}

	static async getAll() {
		return await getDb()
			.collection('products')
			.find()
			.toArray();
	}

	static async getById(id) {
		return await getDb()
			.collection('products')
			.find({ _id: new mongoDb.ObjectID(id) })
			.next();
	}

	static async deleteById(id) {
		await getDb()
			.collection('products')
			.deleteOne({ _id: new mongoDb.ObjectID(id) });
	}
}

module.exports = Product;
