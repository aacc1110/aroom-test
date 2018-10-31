var fs = require('fs');
var https = require('https');

var options = {
    key: fs.readFileSync('./keys/private.pem'),
    cert: fs.readFileSync('./keys/public.pem'),
    agent: false
};

https.createServer(options, function(req, res){
    res.writeHead(200);
    res.end("Hello secure world\n");
}).listen(3000);