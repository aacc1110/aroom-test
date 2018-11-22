var express = require('express');
var router = express.Router();
var path = require('path');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');

module.exports = function(passport){
router.get('/', function(request, response, next) {
    console.log(request.user);
    if(request.user){
        db.query(`SELECT * FROM topic`, function(error, topics){
            var list = template.list(topics);
            response.render('operator', { title: 'operator', name: `${request.user.nickname}`, page: `${list}` });
        });        
    } else{
        response.render('operator', { title: 'operator', name: ``, page: `WELCOME` });
    }

});

router.post('/login_process',
    passport.authenticate('local_login', { 
    successRedirect: '/operator',
    failureRedirect: '/operator#login_form',
    failureFlash: true,
    successFlash: false
}));

router.get('/logout', function(request, response){
    request.logout();
    request.session.save(function(){
        response.redirect('/operator');
    })
})

router.post('/register_process',
    passport.authenticate('local_joinup', {
        successRedirect: '/operator',
        failureRedirect: '/operator#join_form',
        failureFlash: true,
        successFlash: false
    })    
);

  return router;
};
