const path = require('path');
const express = require('express');

const connectToMongoose = require('./database/db');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { handleGet404 } = require('./controllers/error.js');
const UserModel = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(async (req, res, next) => {
	req.user = await UserModel.findOne({ role: 'admin' });
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(handleGet404);

const run = async () => {
	await connectToMongoose();
	app.listen(3000, () => {
		console.log('App is running on port 3000');
	});
};

run();
