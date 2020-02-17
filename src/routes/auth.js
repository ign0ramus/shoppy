const express = require('express');
const { body } = require('express-validator');

const UserModel = require('../database/models/user');

const {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
	handleGetSignup,
	handlePostSignup,
	handleGetReset,
	handlePostReset,
	handleGetNewPassword,
	handlePostNewPassword,
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', handleGetLogin);
router.post('/login', handlePostLogin);
router.post('/logout', handlePostLogout);
router.get('/signup', handleGetSignup);
router.post(
	'/signup',
	[
		body('email')
			.isEmail()
			.withMessage('Please enter a valid email')
			.custom(async email => {
				const isUserExists = await UserModel.findOne({ email });
				if (isUserExists) {
					throw new Error('Email already exists');
				}
			})
			.normalizeEmail(),
		body('password')
			.isLength({ min: 4 })
			.withMessage('Password should be at least 4 characters'),
	],
	handlePostSignup
);
router.get('/reset', handleGetReset);
router.post('/reset', handlePostReset);
router.get('/reset/:token', handleGetNewPassword);
router.post('/new-password', handlePostNewPassword);

module.exports = router;
