// very small express server


var express = require('express');
var app = express();
app.set('port', (process.env.PORT || 5000));
//var io = require('socket.io')(server);


var initApp = function initApp() {

  //create the http server and start it
  //http.createServer(app).listen(9001,function() {
  app.listen(app.get('port'),function() {

    //a message to indicate a successful startup of the http server
    console.log('Your Node.js application is listening on port #: ' + app.get('port'));
  });
};

app.use(express.static('.'));
app.get('/', function(req, res) {
  res.redirect(301, 'dist/index.html');
});

// Start app server
initApp();

//io.on('connection', function (socket) {
//  socket.emit('news', { hello: 'world' });
//  socket.on('my other event', function (data) {
//    console.log(data);
//  });
//});