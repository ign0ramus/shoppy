const path = require('path');
const express = require('express');

const { mongoConnect } = require('./database/mongodb');
const { handleGet404 } = require('./controllers/error.js');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
	const user = await User.findById('5e42a80fa419bc591b3cb84e');
	req.user = new User(user.username, user.email, user._id, user.cart);
	next();
});

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(handleGet404);

mongoConnect(() => {
	app.listen(3000, () => {
		console.log('App is running on port 3000');
	});
});
