var db = require('../lib/db');
var bcrypt = require('bcrypt');
module.exports = function (app){

    var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        db.query('SELECT * FROM operator WHERE id=?'+id, function(err, user){
            console.log('deserializeUser', id, user);
            done(null, id);
        })
    });    

    passport.use('local_login', new LocalStrategy({
        usernameField: 'email_login',
        passwordField: 'pass_login',
        passReqToCallback: true
        },
        function (req, email, password, done) {
            console.log('LocalStrategy', email, password);
            db.query('SELECT * FROM operator WHERE email=?', [email], function(err, user){
                console.log(err); console.log(user);
                if (err) { return done(err); }
                if (user.length) {
                    bcrypt.compare(password, user[0].password, function(err,res){
                        if(res){
                            console.log('Welcome');
                            return done(null, { 'email': email, 'id':user[0].id,
                                message: 'Welcome.'
                            });
                        } else {
                            console.log('Password is not correct.');
                            return done(null, false, {                              
                                message: 'Password is not correct.'
                            });
                        }
        
                    });
                } else {
                    console.log('There is no email.');
                    return done(null, false, {
                        message: 'There is no email.'
                    });
                }
            })

        }
        ));
    return passport;
}