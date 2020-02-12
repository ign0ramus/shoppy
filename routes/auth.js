const express = require('express');

const {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
	handleGetSignup,
	handlePostSignup,
	handleGetReset,
	handlePostRequest,
	handleGetNewPassword,
	handlePostNewPassword,
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', handleGetLogin);
router.post('/login', handlePostLogin);
router.post('/logout', handlePostLogout);
router.get('/signup', handleGetSignup);
router.post('/signup', handlePostSignup);
router.get('/reset', handleGetReset);
router.post('/reset', handlePostRequest);
router.get('/reset/:token', handleGetNewPassword);
router.post('/new-password', handlePostNewPassword);

module.exports = router;
