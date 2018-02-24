const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session'); // for encrypting/decrypting cookie
const passport = require('passport');

const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup'); // we need this so that our google strategy is associated with with passport object
const keys = require('./config/keys');


const app = express();





// set up view engine
app.set('view engine', 'ejs');

// this will set and encrypt login cookie set by passport
app.use(cookieSession({
  // 1 day session (in miliseconds)
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport
app.use(passport.initialize());
// we are using session cookies to control log in
app.use(passport.session()); 

// connect to mongoDB
mongoose.connect(keys.mongodb.dbURI, () => {
  console.log('connected to mongodb on mlab');
});



// set up routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);

// create home route 
app.get('/', (req, res) => {
  res.render('home', { user: req.user });
});



app.listen(3000, () => {
  console.log('app on port 3000');
});