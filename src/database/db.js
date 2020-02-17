const mongoose = require('mongoose');

const connectToMongoose = async () => {
	mongoose.connect(process.env.DB_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
};

module.exports = connectToMongoose;
