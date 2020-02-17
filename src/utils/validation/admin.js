const { body, check } = require('express-validator');

const addOrEditProductValidations = [
	body('title', 'Title should be alphanumeric and minimum 3 characters')
		.isString()
		.isLength({ min: 3 })
		.trim(),
	body('price', 'Price should be floating number').isFloat(),
	check('file', 'Image is required').custom(
		(value, { req }) =>
			Boolean(req.file) || req.originalUrl === '/admin/edit-product'
	),
	body(
		'description',
		'Description length minimum 5 characters and maximum 400 characters'
	)
		.isLength({ min: 5, max: 400 })
		.trim(),
];

module.exports = {
	addOrEditProductValidations,
};
