const handleGetLogin = async (req, res) => {
	res.render('auth/login', {
		path: '/login',
		docTitle: 'Login',
	});
};

module.exports = {
	handleGetLogin,
};
