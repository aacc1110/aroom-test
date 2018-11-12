var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');



module.exports = function(passport){
router.get('/', function(req, res, next) {
    res.render('operator', 
    { title: 'operator', name: 'HSC', page: 'Home page' });
    });  

router.get('/login', function(request, response) { 
    var fmsg = request.flash();
    var feedback = '';
    if(fmsg.error){
    feedback = fmsg.error[0];
    }
    var title = 'WEB - Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
    <div style="color:red;">${feedback}</div>
    <form action="/auth/login_process" method="post">
    <p><input type="text" name="email" placeholder="email"></p>
    <p><input type="password" name="pwd" autocomplete="off" placeholder="password"></p>
    <p>
        <input type="submit" value="login">
    </p>
    </form>`, ``
    ); 
    response.send(html);
});  
router.post('/register_process', function (request, response) {
    var post = request.body;
    console.log(post);
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
    if(pwd !== pwd2){
    request.flash('error', 'Password must same!');
    response.redirect('/auth/register');
    } else {
    bcrypt.hash(pwd, 10, function (err, hash) {
        var user = {
        id: shortid.generate(),
        email: email,
        password: hash,
        displayName: displayName
        };
        db.get('users').push(user).write();
        request.login(user, function (err) {
        console.log('redirect');
        return response.redirect('/');
        })
    })
    }
});

router.post('/login_process',
    passport.authenticate('local', { 
    successRedirect: '/',
    failureRedirect: '/auth/login',
    failureFlash: true,
    successFlash:true
    }));

router.get('/register', function (request, response) {
    var fmsg = request.flash();
    var feedback = '';
    if (fmsg.error) {
        feedback = fmsg.error[0];
    }
    var title = 'WEB - login';
    var list = template.list(request.list);
    var html = template.HTML(title, list, `
        <div style="color:red;">${feedback}</div>
        <form action="/auth/register_process" method="post">
        <p><input type="text" name="email" placeholder="email" value="egoing7777@gmail.com"></p>
        <p><input type="password" name="pwd" autocomplete="off" placeholder="password" value="111111"></p>
        <p><input type="password" name="pwd2" autocomplete="off" placeholder="password" value="111111"></p>
        <p><input type="text" name="displayName" placeholder="display name" value="egoing"></p>
            <p>
            <input type="submit" value="register">
            </p>
        </form>
        `, '');
    response.send(html);
    });

router.get('/logout', function(request, response){
    request.logout();
    request.session.save(function(){
    response.redirect(`/`);
    }); 
    /* request.session.destroy(function(error){
        response.redirect('/');
    }); */
});
return router;
};