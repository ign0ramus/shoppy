const { MongoClient } = require('mongodb');

let _db = null;

const mongoConnect = callback => {
	MongoClient.connect(process.env.DB_HOST, {useUnifiedTopology: true })
		.then(client => {
			_db = client.db('shoppy');
			callback();
		})
		.catch(err => {
			console.error(err);
			throw err;
		});
};

const getDb = () => {
	if (_db) {
		return _db;
	}
	throw 'No db!';
};

module.exports = { mongoConnect, getDb };
