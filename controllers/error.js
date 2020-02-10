const handleGet404 = (req, res) => {
	res.status(404).render('404', { docTitle: 'Page Not Found', path: '' });
};

module.exports = {
    handleGet404
}