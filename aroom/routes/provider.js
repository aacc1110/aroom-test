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
var gm = require('gm');


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
    /*         "pass": post.count,
        "tag": post.tags, 
        "offside": [post.elevator, post.parking] */
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
                        console.log('json creat');
                    });

                }
            })
        }
    })        

    if(files.length > 0){
        upload(request, response, (error) =>{
            if(error){
                console.log(error.message);
                return false;
            } else{
                files.forEach(function(file){
                    console.log(file.filename);
                    gm('uploads/'+file.filename)
                    .resize('500', '400')
                    .noProfile()
                    .write(passName+'/'+post.title+'/'+file.filename, (err) =>{
                        if (err){
                            console.log(err.message);
                        } else{
                            console.log('done-image'); 
                            gm('uploads/'+file.filename)
                            .noProfile()
                            .gravity('center')
                            .resize('150','100', "^>")
                            .quality(60)
                            .crop('150', '100')
                            .write(passName+'/'+post.title+'/'+file.filename+'thumb', (err) =>{
                                if (err){
                                    console.log(err.message);
                                } else{
                                    console.log('done-thumb'); 
/*                                     response.render('entry',{
                                        useremail: request.user.email,
                                        address: post.address,
                                        files: files,
                                        offside: offside,
                                        title: post.title
                                    })  */
                                }
                            })                          
                        }
                    }); 
                });                
            };          
        });       
        console.log('file received');  
    } else{
        console.log('No file received');         
    }

    db.query(`INSERT INTO provider (operator_id, item_type, title, sex, address, price_min, price_max, phone_mobile, offside, imgname)
    SELECT  ?,?,?,?,?,?,?,?,?,?  FROM DUAL
    WHERE NOT EXISTS(SELECT * FROM provider WHERE address='${post.address}')`,[request.user.id, post.item_type, post.title, post.sex, post.address, post.price_min, post.price_max, post.phone_mobile, offside, vector], 
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
    })
/*     response.redirect('../entry', {title: post.title}); */

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

module.exports = router;

