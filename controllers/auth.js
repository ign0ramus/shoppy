const UserModel = require('../models/user');
const bcrypt = require('bcryptjs');

const handleGetLogin = (req, res) => {
	const [error] = req.flash('error');
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
		error,
	});
};

const handlePostLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		const isCredsMatch =
			user && (await bcrypt.compare(password, user.password));
		if (!isCredsMatch) {
			req.flash('error', 'Invalid email or password');
			return res.redirect('/login');
		}

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

const handleGetSignup = (req, res) => {
	const [error] = req.flash('error');
	res.render('auth/signup', {
		path: '/signup',
		docTitle: 'Signup',
		error,
	});
};

const handlePostSignup = async (req, res) => {
	try {
		const { email, password, confirmPassword } = req.body;
		const isUserExists = await UserModel.findOne({ email });

		if (isUserExists) {
			req.flash('error', 'User with this email exists');
			return res.redirect('/signup');
		}

		const hashPassword = await bcrypt.hash(password, 12);
		await UserModel.create({ email, password: hashPassword });

		res.redirect('/login');
	} catch (err) {
		console.error(err);
	}
};

module.exports = {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
	handleGetSignup,
	handlePostSignup,
};
