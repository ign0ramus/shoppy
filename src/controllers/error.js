const handleGet404 = (req, res) => {
	res.status(404).render('errors/404', {
		docTitle: 'Page Not Found',
		path: '',
	});
};

const handleGet500 = (error, req, res) => {
	console.error(error);
	res.render('errors/500', {
		docTitle: 'Error occured!',
		path: '',
	});
};

module.exports = {
	handleGet404,
	handleGet500,
};
