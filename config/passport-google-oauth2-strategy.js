const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');
//const { rejects } = require('assert');
const env = require('./environment');


//tell passport to use a new stategy for google login
passport.use(new googleStrategy({
    clientID : env.google_client_id,
    clientSecret : env.google_client_secret,
    callbackURL : env.google_call_back_URL,
    },
    function(accessToken , refreshToken, profile , done){
        User.findOne({ email: profile.emails[0].value})
        .then( user => {
            //console.log(accessToken,refreshToken);
            console.log(profile);
            if(user){
                return done(null,user);
            }else{
                return User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                })
                .then(newUser => {
                    return done(null, newUser);
                })
                .catch(err => {
                    console.log('error in creating user google strategy-passport',err);
                    return done(err,null);
                }); 
            }
        })
        .catch(err => {
            return done(err, null);
        });
    }
));
module.exports = passport;