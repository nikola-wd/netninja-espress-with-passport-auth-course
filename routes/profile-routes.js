const router = require('express').Router();

// simple middleaware to check if user's id is stored in cookie (if he's logged in)
const authCheck = (req, res, next) => {
  if (!req.user) {
    // if user is not logged in
    res.redirect('/auth/login');
  } else {
    // if user is loggedin proceed to profile page
    next();
  }
};

router.get('/', authCheck, (req, res) => {
  res.render('profile', { user: req.user });
});


module.exports = router;