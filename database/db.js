const mongoose = require('mongoose');

const runMigrations = require('./migrations');

mongoose.set('useFindAndModify', false);

const connectToMongoose = async () => {
	mongoose.connect(process.env.DB_HOST, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	await runMigrations();
};

module.exports = connectToMongoose;
