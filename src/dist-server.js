
var path = require('path');
var config = require('config');

console.log('CONFIG', config, process.env.NODE_ENV);

var Koa = require('koa');
var app = new Koa();
app.use(require('koa-static')(path.resolve(__dirname, '../dist/'), { denyQuerystring: true}));

var port = config.distServer.port;

app.listen(port);
console.log("Serving /dist on: ", port, (path.resolve(__dirname, '../dist/')));