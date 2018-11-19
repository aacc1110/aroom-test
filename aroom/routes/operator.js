var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function(passport){
router.get('/', function(request, response, next) {
    db.query(`SELECT * FROM topic`, function(error, topics){
        var list = template.list(topics);
        response.render('operator', { title: 'operator', name: 'HSC', page: `${list}` });
    });
});

router.post('/login_process',
    passport.authenticate('local_login', { 
    successRedirect: '/',
    failureRedirect: '/operator#login_form',
    failureFlash: true,
    successFlash:true
}));

router.post('/register_process', function (request, response) {
    var post = request.body;
    console.log(post);
    if(post.pass_join !== post.pass1_join){
      request.flash('error', 'Password must same!');
      response.redirect('/operator#join_form');
    } else {
      bcrypt.hash(post.pass_join, 10, function (err, hash) {
          if(err){
              throw err;
          } else{
            db.query(`
            INSERT INTO operator (email, password, nickname) 
            VALUES(?, ?, ?)`,
            [post.email_join, hash, post.nickname], 
            function(error, result){
                if(error){
                    throw error;
                }
                response.redirect('/operator#login_form');
                }
            )
          }
      })
    }
  });

  return router;
};
