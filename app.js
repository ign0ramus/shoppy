const path = require('path');
const express = require('express');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const csrfProtection = require('csurf')();
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');

const connectToMongoose = require('./src/database/db');
const adminRoutes = require('./src/routes/admin');
const shopRoutes = require('./src/routes/shop');
const authRoutes = require('./src/routes/auth');
const { handleGet404, handleGet500 } = require('./src/controllers/error.js');

const PORT = process.env.PORT || 3000;

const app = express();
const store = new MongoDbStore({
	uri: process.env.DB_HOST,
	collection: 'sessions',
});
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
app.set('views', 'src/views');

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
app.use(helmet());

app.use((req, res, next) => {
	res.locals.isAuthenticated = req.session.userId;
	res.locals.csrfToken = req.csrfToken();
	next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);
app.use(handleGet404);
app.use(handleGet500);

const run = async () => {
	try {
		await connectToMongoose();
		app.listen(PORT, () => {
			console.log(`App is running on port ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
};

run();
