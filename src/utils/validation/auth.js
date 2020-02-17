const { body } = require('express-validator');
const UserModel = require('../../database/models/user');

const signUpValidations = [
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
];

const loginValidations = [
	body('email')
		.isEmail()
		.withMessage('Please enter a valid email')
		.normalizeEmail(),
];

const resetValidation = body('email')
	.isEmail()
	.withMessage('Please enter a valid email')
	.normalizeEmail();

module.exports = {
	signUpValidations,
	loginValidations,
	resetValidation,
};
