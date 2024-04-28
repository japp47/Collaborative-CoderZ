var passport = require('passport');
var User = require('./models/user');
var LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function (user, done) {
    done(null, user._id)
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findOne({ _id: id });
        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
});



passport.use(new LocalStrategy ({
    usernameField: 'email'
},
async function(username, password, done) {
    try {
        const user = await User.findOne({ email: username });
        if (!user) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        if (!user.validPassword(password)) {
            return done(null, false, { message: 'Incorrect username or password' });
        }
        return done(null, user);
    } catch (err) {
        return done(err);
    }
}
));