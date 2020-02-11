const mongoDb = require('mongodb');
const { getDb } = require('../database/mongodb');

class User {
	constructor(username, email, id, cart) {
		this.username = username;
		this.email = email;
		this.cart = cart;
		this._id = new mongoDb.ObjectID(id);
	}

	async save() {
		return await getDb()
			.collection('users')
			.insertOne(this);
	}

	static async findById(id) {
		return getDb()
			.collection('users')
			.findOne({ _id: new mongoDb.ObjectID(id) });
	}

	async addToCart(product) {
		const isProductInCart = this.cart.items.some(
			cp => cp.productId.toString() === product._id.toString()
		);

		if (isProductInCart) {
			this.cart.items = this.cart.items.map(item => {
				if (item.productId.toString() === product._id.toString()) {
					return { ...item, quantity: item.quantity + 1 };
				}
				return item;
			});
		} else {
			this.cart.items = [
				...this.cart.items,
				{ productId: new mongoDb.ObjectID(product._id), quantity: 1 },
			];
		}

		await getDb()
			.collection('users')
			.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
	}

	async getCart() {
		const products = await getDb()
			.collection('products')
			.find({ _id: { $in: this.cart.items.map(item => item.productId) } })
			.toArray();
		return products.map(prod => ({
			...prod,
			quantity: this.cart.items.find(
				item => item.productId.toString() === prod._id.toString()
			).quantity,
		}));
	}

	async deleteItemFromCart(id) {
		const updatedCartItems = this.cart.items.filter(
			item => item.productId.toString() !== id.toString()
		);

		await getDb()
			.collection('users')
			.updateOne(
				{ _id: this._id },
				{ $set: { cart: { items: updatedCartItems } } }
			);
	}

	async addOrder() {
		await getDb()
			.collection('orders')
			.insertOne({
				user: {
					userId: this._id,
					username: this.username,
					email: this.email,
				},
				items: await this.getCart(),
			});
		this.cart = { items: [] };
		await getDb()
			.collection('users')
			.updateOne({ _id: this._id }, { $set: { cart: this.cart } });
	}

	async getOrders() {
		return await getDb()
			.collection('orders')
			.find({ 'user.userId': this._id })
			.toArray();
	}
}

module.exports = User;
