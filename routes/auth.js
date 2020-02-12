const express = require('express');

const {
	handleGetLogin,
	handlePostLogin,
	handlePostLogout,
} = require('../controllers/auth');

const router = express.Router();

router.get('/login', handleGetLogin);
router.post('/login', handlePostLogin);
router.post('/logout', handlePostLogout);

module.exports = router;
