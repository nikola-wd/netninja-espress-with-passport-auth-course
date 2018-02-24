const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const keys = require('./keys');
const User = require('../models/user-model');

// store id to cookie
passport.serializeUser((user, done) => {
  // not _id, just id
  done(null, user.id); 
});

// get user id from cookie, and find correspondent user in DB
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user); // passes user for the next stage
    })
    .catch(err => console.log(err));
});


passport.use(
  new GoogleStrategy({
    // options for strategy: we setup these on: https://console.developers.google.com/apis/
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'
  }, (accessToken, refreshToken, profile, done) => {
    // passport callBack fn (we store user in mongoDB here OR just log in if based on check he is already registered and exists in DB)
    // console.log(profile); // shows all retrieved user data
    // check if user already exist in db, if he does, just log him, don't create duplicate records
    User.findOne({ googleid: profile.id }).then(currentUser => {
      if (currentUser) {
        // if it finds the record
        console.log('user has been found in DB: ' + currentUser);
        done(null, currentUser); // this calls serializeUser method
      } else {
        // if not, create user in DB
        new User({
          username: profile.displayName,
          googleid: profile.id,
          thumbnail: profile._json.image.url
        })
        .save()
        .then(newUser => {
          console.log('new user created: ' + newUser);
          done(null, newUser); // we call serializeUser in this case as well to store cookie with user's id
        })
        .catch(err => console.log(err));
      }
    });

  })
);