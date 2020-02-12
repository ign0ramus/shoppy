const UserModel = require('../models/user');

const handleGetLogin = (req, res) => {
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
		isAuthenticated: false,
	});
};

const handlePostLogin = async (req, res) => {
	try {
		const user = await UserModel.findOne({ role: 'admin' });
		req.session.userId = user.id;
		req.session.save(err => {
			if (err) {
				console.error(err);
			}
			res.redirect('/');
		});
	} catch (err) {
		console.error(err);
	}
};

const handlePostLogout = (req, res) => {
	req.session.destroy(err => {
		if (err) {
			console.error(err);
		}
		res.redirect('/');
	});
};

module.exports = {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
};
