const router = require('express').Router();
const passport = require('passport');

// auth login
router.get('/login', (req, res) => {
  // if user already logged in but tries to go to login page redirect him to /
  if (req.user) {
    res.redirect('/');
  } else {
    res.render('login', { user: req.user });
  }
});

// auth logout
router.get('/logout', (req, res) => {
  // handle with passport
  req.logout(); // this will clear the cookie containing user ID, hence, it will log him out
  res.redirect('/');
});


// auth with google+        // it activates google strategy that we defined
router.get('/google', passport.authenticate('google', {
  // we want only profile data for now
  scope: ['profile']
}));

// callback route for google to redirect to    // at this point authenticate will use cb fn defined in out googleStrategy
router.get('/google/redirect', passport.authenticate('google'), (req, res) => {
  // res.send(req.user);
  res.redirect('/profile');
})

module.exports = router;