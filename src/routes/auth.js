const express = require('express');
const { body } = require('express-validator');

const {
	signUpValidations,
	loginValidations,
	resetValidation,
} = require('../utils/validation/auth');
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
router.post('/login', loginValidations, handlePostLogin);
router.post('/logout', handlePostLogout);
router.get('/signup', handleGetSignup);
router.post('/signup', signUpValidations, handlePostSignup);
router.get('/reset', handleGetReset);
router.post('/reset', resetValidation, handlePostReset);
router.get('/reset/:token', handleGetNewPassword);
router.post('/new-password', handlePostNewPassword);

module.exports = router;
