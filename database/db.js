const mongoose = require('mongoose');

const runMigrations = require('./migrations');

const connectToMongoose = async () => {
	mongoose.connect(process.env.DB_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
};

module.exports = connectToMongoose;
