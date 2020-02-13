const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const connectToMongoose = require('./database/db');
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');
const { handleGet404 } = require('./controllers/error.js');

const app = express();
const store = new MongoDbStore({
	uri: process.env.DB_HOST,
	collection: 'sessions',
});
const csrfProtection = csrf();
const storage = multer.diskStorage({
	destination: 'images',
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});
const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg' ||
		file.mimetype === 'image/jpeg'
	) {
		return cb(null, true);
	}
	req.fileTypeError = 'Image is not valid';
	cb(null, false);
};

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(multer({ storage, fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
	session({
		secret: process.env.SECRET,
		resave: false,
		saveUninitialized: false,
		store,
	})
);
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(handleGet404);

app.use((error, req, res, next) => {
	console.error(error);
	res.render('500', {
		docTitle: 'Error occured!',
		path: '',
	});
});

const run = async () => {
	try {
		await connectToMongoose();
		app.listen(3000, () => {
			console.log('App is running on port 3000');
		});
	} catch (err) {
		console.error(err);
	}
};

run();
