const express = require('express');

const { handleGetLogin } = require('../controllers/auth');

const router = express.Router();

router.get('/login', handleGetLogin);

module.exports = router;
