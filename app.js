const http = require('http');

const path = require('path')

const express = require('express');
var bodyParser = require('body-parser');
//const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error');

const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');//--EJS Engine
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

//Middleware
app.use((req, res, next) => {
	User.findById('5e6b52982f60f11520e6d544')
	.then(user => {
	 	req.user = user
	 	next()
	}).catch(error => {
	 	console.log(error);
	})
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
  app.listen(3000);
});

//bVarJkbh4P3zhCBR