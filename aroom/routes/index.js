var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index.html', { title: 'Express1', name: 'HSC', page: 'Home page' });
});

module.exports = router;
