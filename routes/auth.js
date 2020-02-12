const express = require('express');

const {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
	handleGetSignup,
	handlePostSignup,
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', handleGetLogin);
router.post('/login', handlePostLogin);
router.post('/logout', handlePostLogout);
router.get('/signup', handleGetSignup);
router.post('/signup', handlePostSignup);

module.exports = router;
