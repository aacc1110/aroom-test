var express = require('express');
var router = express.Router();
var template = require('../lib/template.js');
 
//route, routing
//app.get('/', (req, res) => res.send('Hello World!'))
router.get('/:pageId', function(request, response) { 
    var title = 'Login';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
      `
      <form action="login_process" method="post">
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="password" placeholder="password"></p>
        <p><input type="submit"></p>
      </form>
      `,
      ``
    ); 
    response.send(html);
}); 

router.post('/login_process', function(request, response){
    var post = request.body;
    if(post.email === 'aacc1111@daum.net' && post.password === '1111'){
        response.writeHead(302, {
            'Set-Cookie':[
              `email=${post.email}; Path=/`,
              `password=${post.password}; Path=/`,
              `nickname=egoing; Path=/`
            ], Location:'/'});
        response.end();
    } else{
        response.end('who?');
    };
  });
router.get('/logout_process', function(request, response){
    response.writeHead(302, {
        'Set-Cookie':[
          `email=; Max-Age=0`,
          `password=; Max-Age=0`,
          `nickname=; Max-Age=0`
        ], Location:'/'});
    response.end();
});

module.exports = router;