const cors = require('cors') // Place this with other requires (like 'path' and 'express')
const corsOptions = {
  origin: "https://ASKAS.herokuapp.com/",
  optionsSuccessStatus: 200
};

const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./models/user');
const csrf = require('csurf');
const flash = require('connect-flash');
const compression = require('compression');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;
const store = new MongoDBStore({
  uri: MONGODB_URL,
  collection: 'sessions'
});
const csrfProtection = csrf();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 3000 // So we can run on heroku || (OR) localhost:3000

const app = express();

// Route setup. You can implement more in the future!
app.use(cors(corsOptions));

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  family: 4
};

const routes = require('./routes');

app.use(compression());

app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .use(bodyParser({ extended: false })) // For parsing the body of a POST
  .use(
    session({
      secret: 'my secret',
      resave: false,
      saveUninitialized: false,
      store: store
    })
  )
  .use(csrfProtection)
  .use(flash())

  .use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.user = req.session.user;
    res.locals.csrfToken = req.csrfToken();
    next();
  })

  .use((req, res, next) => {
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
  })

  .use('/', routes);

mongoose
  .connect(MONGODB_URL, options)
  .then(result => {
    console.log("listening on port 3000");
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });
  