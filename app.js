
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');



var app = express();



// all environments
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
//app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.engine('.html', require('ejs').renderFile);

app.get('/', routes.index);
app.get('/users', user.list);
app.post('/fetchdb', routes.fetchdb);


app.get('/control', express.basicAuth('express','irisjoe'), function(req, res){
  
  routes.fetchWinners(function(err, data){
    res.render('control', { title: 'Express2', winners:data });
    
  })
})


var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  

  
});



var io = require('socket.io').listen(server, {log:false});
io.sockets.on('connection', function (socket) {
    
    
    //socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });

    socket.on('draw', function(data){
      io.sockets.emit('start-draw',{draw:'now'});
    })

    socket.on('new-winner', function(data){
      routes.markAsWinner(data.EMAILADDRESS);
      io.sockets.emit('new-winnerfound',data);
    })

    socket.on('clear-winners', function(data){
      routes.clearWinners(function(err){

      });
    })

  });