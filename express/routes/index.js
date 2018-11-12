  var express = require('express');
  var router = express.Router();
  var template = require('../lib/template.js');
  var auth = require('../lib/auth.js');

    /* GET home page. */
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express1', name: 'HSC', page: __dirname });
}); */

router.get('/', function (request, response) {
  var fmsg = request.flash();
  var feedback = '';
  if(fmsg.success){
    feedback = fmsg.success[0];
  }
  var title = 'Welcome';
  var description = 'Hello, Node.js';
  var list = template.list(request.list);
  var html = template.HTML(title, list,
    `
      <div style="color:blue;">${feedback}</div>
      <h2>${title}</h2>${description}
      `,
    `<a href="/topic/create">create</a>`,
    auth.statusUI(request, response)
  );
  response.send(html);
});
module.exports = router;