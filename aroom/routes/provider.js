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
var jimp = require('jimp');


var upload = multer({
  limits:{fileSize: 1000000},
  storage: multer.diskStorage({
    destination: (request, file, cb) => {
      cb(null, 'uploads/');
      //console.log(file);
    },
    filename: (request, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
//        console.log(file);  
    }
  })
}).array('image', 5);

router.post('/uploads', upload, (request, response) =>{
  var post = request.body;
  var files = request.files;
  var offside = post.elevator + ',' + post.parking;
  var passName = 'data/'+request.user.email;
  var vector =JSON.stringify({
      'vector': [post.count, post.tags, post.elevator, post.parking, post.address, post.price_min, post.price_max]
      });
  console.log(files.filename);
  fs.mkdir(passName, (err) => { 
    if (err && err.code != 'EEXIST'){
      throw err;
    } else{
      fs.mkdir(passName+'/'+post.title, (err) =>{
        if (err && err.code != 'EEXIST'){
          throw err;
        } else{
          jsonfile.writeFile(passName+'/'+post.title+'/'+post.title+'.json', post, (err, data) =>{
            if (err && err.code != 'EEXIST'){
              throw err;
            } else{
              console.log('json creat');
              if(files.length > 0){
                upload(request, response, (error) =>{
                  if(error){
                    console.log(error.message);
                    return false;
                  } else{
                    var named = [];
                      files.forEach((file, index) => {
                      console.log('uploads/'+file.filename);
                      named.push(file.filename);
                      jimp.read('uploads/'+file.filename)
                      .then(img =>{
                        return img.resize(500, jimp.AUTO)
                        .quality(90)
                        .write(passName+'/'+post.title+'/'+file.filename);
                      }).then(img =>{
                        return img.resize(150, jimp.AUTO)
                        .quality(70)
                        .write(passName+'/'+post.title+'/thumb-'+file.filename);
            
                      }).catch(err =>{
                        console.error(err.message);
                      });
                    });
                    console.log(named);
                    jsonfile.readFile(passName+'/'+post.title+'/'+post.title+'.json',(err,oldData) =>{
                      if(err){console.error(err);}
                      jsonfile.writeFile(passName+'/'+post.title+'/'+post.title+'.json',Object.assign(data,{imgname: named}),(err) =>{
                        if(err){ throw err; }
                        console.log('Saved');
                      })
                    })                    
                    response.render('provider_view', {
                        address: post.address,
                        useremail: request.user.email,
                        title: post.title,
                        files: files,
                        count: post.count
                        
                    })                 
                  };          
                });
                console.log('file received');  
              } else{
                console.log('No file received');         
              }
            }
          });
        }
      })
    }
  })        


  db.query(`INSERT INTO provider (operator_id, item_type, title, sex, address, price_min, price_max, phone_mobile, offside, imgname)
  SELECT  ?,?,?,?,?,?,?,?,?,?  FROM DUAL
  WHERE NOT EXISTS(SELECT * FROM provider WHERE address='${post.address}')`,[request.user.id, post.item_type, post.title, post.sex, post.address, post.price_min, post.price_max, post.phone_mobile, offside, vector], 
  (error, result, fileds) => {
    if (error){ 
    console.log(error);
      throw error; 
    }
    if(result.affectedRows === 0){
    console.log('값이 있습니다.');

    } else{
      console.log('저장했습니다.');       
    }      
  });
 
/*     response.redirect('../entry', {title: post.title}); */

});

router.get('/', (request, response, next) => {
  console.log(request.user.email);
  if(request.user){
 
    db.query(`SELECT * FROM topic`, (error, topics) =>{
      var list = template.list(topics);
      response.render('provider', { title: 'provider', name: `${request.user.nickname}`, page: `${list}` });
    });        
  } else{
    response.render('provider', { title: 'provider', name: ``, page: `WELCOME` });
  }
});

module.exports = router;

