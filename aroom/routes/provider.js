var express = require('express');
var router = express.Router();
var path = require('path');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

/* module.exports = function(passport){ */
router.get('/', function(request, response, next) {
    console.log(request.user.email);
    if(request.user){
        db.query(`SELECT * FROM topic`, function(error, topics){
            var list = template.list(topics);
            response.render('provider', { title: 'provider', name: `${request.user.nickname}`, page: `${list}` });
        });        
    } else{
        response.render('provider', { title: 'provider', name: ``, page: `WELCOME` });
    }

});

router.post('/provider_process', function (request, response) {
    var post = request.body;
    console.log(post);
    response.redirect('../operator')
    var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName;
/*     if(pwd !== pwd2){
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
    } */
  });
  module.exports = router;
/*   return router;
}; */
