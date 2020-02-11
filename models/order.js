const mongoose = require('mongoose');

const { Schema } = mongoose;

const Order = new Schema({
	products: [
		{
			title: {
				type: String,
				required: true,
			},
			price: {
				type: Number,
				required: true,
			},
			imageUrl: {
				type: String,
				required: true,
			},
			quantity: {
				type: Number,
				required: true,
			},
		},
	],
	userId: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
});

module.exports = mongoose.model('Order', Order);
