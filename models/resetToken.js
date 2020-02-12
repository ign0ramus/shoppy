const mongoose = require('mongoose');

const { Schema } = mongoose;

const ResetToken = new Schema({
	value: {
		type: String,
		required: true,
	},
	expirationDate: {
		type: Date,
		required: true,
	},
	userId: {
		type: Schema.Types.ObjectId,
		required: true,
	},
});

module.exports = mongoose.model('ResetToken', ResetToken);
