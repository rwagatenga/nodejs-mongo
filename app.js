const http = require('http');

const path = require('path')

const express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
//const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error');
//---It can be used when you want to integrate payment method--
// const shopController = require('./controllers/shop');
// const isAuth = require('./middleware/is-auth');

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const MongoDb_uri = "mongodb+srv://node:bVarJkbh4P3zhCBR@nodejs-cs7gj.mongodb.net/shop";
const app = express();
const store = new MongoDBStore({
  uri: MongoDb_uri,
  collection: 'sessions'
});

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.set('view engine', 'ejs');//--EJS Engine
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use(
  session({
    secret: 'my secret',
    cookie: {
    	maxAge: 3600000
    },
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);

app.use(flash());
//---It can be used when you want to integrate payment method--
// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   next();
// });

//Middleware
// app.use((req, res, next) => {
// 	User.findById('5e7216a546715921185b1924')
// 	.then(user => {
// 		//mongoDb
// 	 	//req.user = new User(user.name, user.email, user.cart, user._id);
// 	 	//mongoose
// 	 	req.session.user = user;
// 	 	next()
// 	}).catch(error => {
// 	 	console.log(error);
// 	})
// })
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync Dummy');
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err));
    });
});

//---It can be used when you want to integrate payment method--

// app.post('/create-order', isAuth, shopController.postOrder);

// app.use(csrfProtection);
// app.use((req, res, next) => {
//   res.locals.csrfToken = req.csrfToken();
//   next();
// });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

//Mongoose Drive
//const uri = "mongodb+srv://node:bVarJkbh4P3zhCBR@nodejs-cs7gj.mongodb.net/shop?retryWrites=true&w=majority";
mongoose.connect(MongoDb_uri, {useUnifiedTopology: true, useNewUrlParser: true })
	.then(result => {
		app.listen(3000);
		console.log('Connected');
	}).catch(err => {
		console.log(err);
	})
//mongoDb driver
// mongoConnect(() => {
//   app.listen(3000);
// });

//bVarJkbh4P3zhCBR