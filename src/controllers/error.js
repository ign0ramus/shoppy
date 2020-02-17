const handleGet404 = (req, res) => {
	res.status(404).render('errors/404', {
		docTitle: 'Page Not Found',
		path: '',
	});
};

const handleGet500 = (req, res) => {
	res.status(500).render('500', {
		docTitle: 'Error',
		path: '',
	});
};

module.exports = {
	handleGet404,
	handleGet500,
};
