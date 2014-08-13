
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
app.set('port', process.env.PORT || 1000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var Twit = require('twit')

var T = new Twit({
    consumer_key:         '3W5KFrEsusqoIjvOdswtQ'
  , consumer_secret:      'wkx3NpmQUo8LDQtnEo9tYHlW1ZwfWz78Hfoi6Dw7pY'
  , access_token:         '440647593-OttOAy2E6N8nuusZCfD5LKoukefQjlUiIqCq6SzM'
  , access_token_secret:  'LKZTsCNR0Jkn6uUZn6JSH8oAzV1xZIMEBazFMgP8EkyD0'
})

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var sanFrancisco = ['-122.75', '36.8', '-121.75', '37.8'];
var losAngeles = ['34.172684','-118.604794','34.236144','-118.500938']; 

var stream = T.stream('statuses/filter', {track:'Ukraine'});



app.get('/users', user.list);

var server = http.createServer(app); 

var io = require('socket.io').listen(server);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {
 stream.on('tweet', function (tweet) { 
   if (tweet.geo != null){
     // console.log(tweet); 
     socket.emit('tweets', {lad: tweet.geo.coordinates[1], lon: tweet.geo.coordinates[0], rad: tweet.user.followers_count, text: tweet.text, name:tweet.user.name});
   }
 });
 });


server.listen(app.get('port'), function(){
 console.log('Express server listening on port ' + app.get('port'));
}); 