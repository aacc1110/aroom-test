var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs-extra');
var template = require('../lib/template.js');
var shortid = require('shortid');
var db = require('../lib/db');
var bcrypt = require('bcrypt');
var multer = require('multer');
var fetch = require('node-fetch');
var jsonfile = require('jsonfile');


var upload = multer({
    limits:{fileSize: 1000000},
    storage: multer.diskStorage({
      destination: (request, file, cb) => {

        cb(null, 'uploads');
      },
      filename: (request, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
//        cb(null, new Date().valueOf() + path.extname(file.originalname));
      }
    })
}).array('image', 5);

router.post('/uploads', upload, (request, response) =>{
    var post = request.body;
    var offside = post.elevator + ',' + post.parking;
    var passName = 'data/'+request.user.email;
    var imgpass =JSON.stringify({
        "pass": post.count,
        "tag": post.tags, 
        "offside": {"elevator": post.elevator, "parking": post.parking},
        });
//    var images = null;
console.log(post);
    if(request.files.length > 0){
//        images = true;
        upload(request, response, (error) =>{
            if(error){
                console.log(error.message);
                return false;
            } 
        });

        fs.mkdir(passName, (err) => { 
            if (err && err.code != 'EEXIST'){
                throw err;
            } else{
                fs.mkdir(passName+'/'+post.title, (err) =>{
                    if (err && err.code != 'EEXIST'){
                        throw err;
                    } else{
                        fs.writeJSON(passName+'/'+post.title+'/'+post.title+'.json', post, (err, data) =>{
                            if (err && err.code != 'EEXIST'){
                                throw err;
                            }
                            console.log('file creat');
                        });
                    }
                })
            }
        })

       
        console.log('file received');  
        console.log(request.files);
    } else{
        console.log('No file received');         
      }

    db.query(`INSERT INTO provider (operator_id, item_type, title, sex, address, price_min, price_max, phone_mobile, offside, imgname)
    SELECT  ?,?,?,?,?,?,?,?,?,?  FROM DUAL
    WHERE NOT EXISTS(SELECT * FROM provider WHERE address='${post.address}')`,[request.user.id, post.item_type, post.title, post.sex, post.address, post.price_min, post.price_max, post.phone_mobile, offside, imgpass], 
    function(error, result, fileds){
        if (error){ 
            console.log(error);
            throw error; 
        }
        if(result.affectedRows === 0){
            console.log('값이 있습니다.');

        } else{
            console.log('저장했습니다.');       
        }
        response.render('entry', { title: 'provider', name: ``, page: `이미지 YES (관리자의 승인을 기다리는중입니다.)` });
    })
});

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

router.post('/provider_process', (request, response) => {
    var post = request.body;
    console.log(post);
    if(!request.files){
        console.log('No file received');
    } else{
        console.log('file received');
        console.log(request.files);
    }
/*     response.redirect('../operator'); */
/*     var email = post.email;
    var pwd = post.pwd;
    var pwd2 = post.pwd2;
    var displayName = post.displayName; */
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
