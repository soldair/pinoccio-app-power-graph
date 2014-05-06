var http = require('http');
var fs = require('fs');

var indexHtml = fs.readFileSync(__dirname+'/index.html');
var bundleJs = fs.readFileSync(__dirname+'/bundle.js');


http.createServer(function(req,res){
  if(req.url == '/') res.end(indexHtml);
  else if(req.url == '/bundle.js') res.end(bundleJs);
  else {
    res.writeHead(404);
    res.end('not found.');
  }

}).listen(process.env.PORT||8787,function(){
  console.log('listening on ',this.address());
});



