const path = require('path');
const express = require('express');
const { handleGet404 } = require('./controllers/error.js');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(handleGet404);

app.listen(3000, () => {
	console.log('App is running on port 3000');
});
