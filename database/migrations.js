const UserModel = require('../models/user');

const addAdmin = async () => {
	const admin = await UserModel.findOne({ role: 'admin' });

	if (!admin) {
		await UserModel.create({
			name: 'admin',
			email: 'admin',
			role: 'admin',
		});
	}
};

const runMigrations = async () => {
	await addAdmin();
};

module.exports = runMigrations;
