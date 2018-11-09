var cookie = require('cookie');
module.exports = {
  HTML:function(title, list, body, control, authStatusUI = '<a href="/login/login">login</a>'){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      ${authStatusUI}
      <h1><a href="/">WEB</a></h1>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
      list = list + `<li><a href="/topic/${filelist[i]}">${filelist[i]}</a></li>`;
      i = i + 1;
    }
    list = list+'</ul>';
    return list;
  }, authIsOwner:function (request, response){
    var isOwner = false;
    var cookies = {};
    if (request.headers.cookie){
      cookies = cookie.parse(request.headers.cookie);
    };
    if(cookies.email === 'aacc1111@daum.net' && cookies.password === '1111'){
      isOwner = true;
    };
    return isOwner;
  }, authStatusUI:function (request, response){
     if(this.authIsOwner(request, response)){
      authStatusUI = '<a href="/login/logout_process">logout</a>'     
    } else{
      var authStatusUI = '<a href="/login/login">login</a>';
    }; 
    return authStatusUI;
  }
}