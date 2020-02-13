const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');

const UserModel = require('../models/user');
const ResetTokenModel = require('../models/resetToken');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const addUserIdToSession = (req, res, userId) => {
	req.session.userId = userId;
	req.session.save(err => {
		if (err) {
			next(err);
		}
		res.redirect('/');
	});
};

const handleGetLogin = (req, res, next) => {
	const [error] = req.flash('error');
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
		error,
	});
};

const handlePostLogin = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		const user = await UserModel.findOne({ email });
		const isCredsMatch =
			user && (await bcrypt.compare(password, user.password));
		if (!isCredsMatch) {
			req.flash('error', 'Invalid email or password');
			return res.redirect('/login');
		}

		addUserIdToSession(req, res, user.id);
	} catch (err) {
		next(err);
	}
};

const handlePostLogout = (req, res, next) => {
	req.session.destroy(err => {
		if (err) {
			return next(err);
		}
		res.redirect('/');
	});
};

const handleGetSignup = (req, res, next) => {
	res.render('auth/signup', {
		path: '/signup',
		docTitle: 'Signup',
		error: null,
		oldInput: null,
	});
};

const handlePostSignup = async (req, res, next) => {
	try {
		const { email, password } = req.body;

		const errors = validationResult(req).formatWith(({ msg }) => msg);
		if (!errors.isEmpty()) {
			return res.status(422).render('auth/signup', {
				path: '/signup',
				docTitle: 'Signup',
				error: errors.array(),
				oldInput: { email, password },
			});
		}

		const hashPassword = await bcrypt.hash(password, 12);
		const user = await UserModel.create({ email, password: hashPassword });

		sgMail.send({
			to: email,
			from: 'ign0ramus.github.io@shoppy.com',
			subject: 'Successfull sign up',
			html: `
			<h1>Welcome!</h1>
			<br/>
			<h2>Signing up to Shoppy successfully!</h2>
			`,
		});

		addUserIdToSession(req, res, user.id);
	} catch (err) {
		next(err);
	}
};

const handleGetReset = (req, res, next) => {
	const [error] = req.flash('error');
	const [message] = req.flash('message');
	res.render('auth/reset', {
		path: '/reset',
		docTitle: 'Reset Password',
		error,
		message,
	});
};

const handlePostReset = (req, res, next) => {
	crypto.randomBytes(32, async (err, buffer) => {
		if (err) {
			return next(err);
		}
		const token = buffer.toString('hex');
		try {
			const { email } = req.body;
			const user = await UserModel.findOne({
				email,
			});

			if (user) {
				await ResetTokenModel.create({
					value: token,
					expirationDate: Date.now() + 3600000,
					userId: user,
				});

				await sgMail.send({
					to: email,
					from: 'ign0ramus.github.io@shoppy.com',
					subject: 'Password reset',
					html: `
					<h1>You requested password reset</h1>
					<p>Click this <a href="${process.env.HOST}/reset/${token}">link</a> to reset password</p>
					<p>This link  valid only for one hour</p>
					`,
				});
			}

			req.flash('message', 'To continue password resetting check your email');
			res.redirect('/reset');
		} catch (error) {
			next(error);
		}
	});
};

const handleGetNewPassword = async (req, res, next) => {
	try {
		const token = await ResetTokenModel.findOne({
			value: req.params.token,
			expirationDate: { $gt: Date.now() },
		});

		if (token) {
			const [error] = req.flash('error');
			return res.render('auth/newPassword', {
				path: '/new-password',
				docTitle: 'New Password',
				error,
				userId: token.userId,
				token: token.value,
			});
		}

		res.redirect('/');
	} catch (err) {
		next(err);
	}
};

const handlePostNewPassword = async (req, res, next) => {
	try {
		const { password, userId, token } = req.body;
		const [hashPassword] = await Promise.all([
			bcrypt.hash(password, 12),
			ResetTokenModel.findOneAndDelete({ value: token }),
		]);

		const user = await UserModel.findOneAndUpdate(
			{ _id: userId },
			{ password: hashPassword }
		);

		addUserIdToSession(req, res, user.id);
	} catch (err) {
		next(err);
	}
};

module.exports = {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
	handleGetSignup,
	handlePostSignup,
	handleGetReset,
	handlePostReset,
	handleGetNewPassword,
	handlePostNewPassword,
};
