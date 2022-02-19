// libraries
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

require('./middlewares/passport').validate(passport)
// middlewares/
const errorHandling = require('./middlewares/errorHandling');
// const auth = require('./middlewares/auth');

// router
const router = require('./router/indexRouter');

// app creation
const app = express();

// using libraries
// app.use(fileUpload({ createParentPath : true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
}))

//passport
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})
app.use(cookieParser());
// app.use(auth);
app.use(morgan('tiny'));
// setting ejs to be view engine
app.set('view engine', 'ejs');

// allow public directory
app.use(express.static('public'))

//app.set('strict routing', true);
// using router
app.use('/', router);

// using error handling middleware
app.use(errorHandling.notFound);
app.use(errorHandling.errorHandler);

module.exports = app;