var db = require('../lib/db');
var bcrypt = require('bcrypt');
module.exports = function (app){

    var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    app.use(passport.initialize());
    app.use(passport.session());

    // 로그인에 성공하면 session에 값을 저장해라
    passport.serializeUser(function(user, done) {
        console.log('serializeUser', user);
        done(null, user.id);
    });
    // 로그인이 된 상태에서 홈페이지에 방문시마다 아이디를 체크한다.
    passport.deserializeUser(function(id, done) {
        db.query('SELECT * FROM operator WHERE id=?',[id], function(err, user){
            done(null, user[0]);
        console.log('deserializeUser', id);
        })
    });    

    passport.use('local_login', new LocalStrategy({
        usernameField: 'email_login',
        passwordField: 'pass_login',
        passReqToCallback: true
        },
        function (request, email, password, done) {
            console.log('LocalStrategy', email, password);
            db.query('SELECT * FROM operator WHERE email=?', [email], function(err, user){
//                console.log(err); console.log(user);
                if (err) { return done(err); }
                if (user.length) {
                    bcrypt.compare(password, user[0].password, function(err,res){
                        if(res){
                            console.log('Welcome');
                            return done(null, user[0], { 'email': email, 'id':user[0].id,
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

    passport.use('local_joinup', new LocalStrategy({
        usernameField: 'email_join',
        passwordField: 'pass_join',
        passReqToCallback: true
    }, 
    function (request, email, password, done) {
        console.log('joinup', email, password); 
        db.query('SELECT * FROM operator WHERE email=?',[email], function(err, user){
            console.log(user);
            if(err){ return done(err); } 
            if(user.length > 0){
                console.log('email is in USE.', email, password);
                return done(null, false, {
                    message: 'email is in USE.'
                });
            } else{
                var newUser={
                    email: email,
                    password: bcrypt.hashSync(password, 10, null),
                    nickname: request.body.nickname
                }
                db.query(`INSERT INTO operator (email, password, nickname) VALUES(?, ?, ?)`, [newUser.email, newUser.password, newUser.nickname], function(err, res){
                    if(err){ 
                        return done(err); 
                    } else{
                        newUser.id = res.insertId;
                        console.log('newUser', newUser);
                        return done(null, newUser, {
                            message: 'welcome join'
                        });
                    }
                })
            }
        }) 
        }       
    ))
    return passport;
}