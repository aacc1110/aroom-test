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


router.get('/', function(request, response, next) {
    console.log(request.user.email);
    console.log(request.title);
    if(request.user){
//        var jsonfile = fs.readFile('data/'+request.user.email+'/'+request.title+'/adasd.json');
//        console.log(jsonfile)
        response.render('entry', { 
            title: 'entry', 
            name: request.user.email,
            page: jsonfile 
        });
    } else{
        response.render('entry', { title: 'entry', name: ``, page: `WELCOME` });
    }

});

module.exports = router;

