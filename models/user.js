const mongoose = require('mongoose');

const { Schema } = mongoose;

const User = new Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
		default: 'user',
	},
	cart: [
		{
			productId: {
				type: Schema.Types.ObjectId,
				ref: 'Product',
				required: true,
			},
			quantity: { type: Number, required: true },
		},
	],
});

User.methods.addToCart = async function(product) {
	const productInCartIdx = this.cart.findIndex(
		item => item.productId.toString() === product._id.toString()
	);

	if (productInCartIdx >= 0) {
		this.cart[productInCartIdx].quantity =
			this.cart[productInCartIdx].quantity + 1;
	} else {
		this.cart = [...this.cart, { productId: product, quantity: 1 }];
	}

	await this.save();
};

User.methods.getCart = async function() {
	await this.populate('cart.productId').execPopulate();

	return this.cart.map(item => ({
		id: item.productId._id,
		title: item.productId.title,
		price: item.productId.price,
		imageUrl: item.productId.imageUrl,
		quantity: item.quantity,
	}));
};

User.methods.removeItemFromCart = async function(productId) {
	this.cart = this.cart.filter(item => item.productId.toString() !== productId);

	await this.save();
};

User.methods.clearCart = async function() {
	this.cart = [];
	await this.save();
};

module.exports = mongoose.model('User', User);
