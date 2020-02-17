const { body, check, oneOf } = require('express-validator');

const addOrEditProductValidations = [
	body('title', 'Title should be alphanumeric and minimum 3 characters')
		.isString()
		.isLength({ min: 3 })
		.trim(),
	body('price', 'Price should be floating number').isFloat(),
	oneOf(
		[
			check('file').custom((value, { req }) => req.file || req.body.image),
			body('imageUrl').isURL(),
		],
		'Image is required. Image file or image URL is not valid'
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
