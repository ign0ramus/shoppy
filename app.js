const path = require('path');
const express = require('express');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const { adminRouter } = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRoutes);
app.use('/admin', adminRouter);

app.use((req, res) => {
	res.status(404).render('404', { docTitle: 'Page Not Found' });
});

app.listen(3000, () => {
	console.log('App is running on port 3000');
});
