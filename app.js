/* global process, require, console */
var express = require('express'),
    port = process.env.PORT || 8000,
    redis = require("redis").createClient(),
    io = require('socket.io'),
    defaultRecipe = require('./server/default-recipe.js'),
    app = express();

redis.on("error", function (err) {
    console.log("Redis error: " + err);
});

app.use(express.logger()).
    use(express.static('dist')).
    use(express.query()).
    use(express.bodyParser());

io = io.listen(app.listen(port));

io.sockets.on('connection', function (socket) {
  function loadRecipe(compId, broadcast) {
    redis.get('recipe:' + compId, function (err, recipe) {
      var target = broadcast ? socket.broadcast.to(compId) : socket;
      if (err) {
        target.emit('error', err);
      } else {
        recipe = recipe ? JSON.parse(recipe) : defaultRecipe;
        target.emit('recipe', recipe);
      }
    });
  }

  socket.on('login', function (compId) {
    if (typeof compId !== "string") { return; }
    if (compId.length < 3) { return; }
    socket.join(compId);
  });

  socket.on('load', function (req) {
    if (typeof req.compId !== "string") { return; }
    if (req.compId.length < 3) { return; }
    loadRecipe(req.compId);
  });

	socket.on('save', function (data) {
    console.log('socket---save');
    if (!data || !data.compId) {
      console.log('empty save:');
      console.log(data);
      console.log('-----------');
      return;
    }

    console.log('got data to save:\n' + data);
		data = JSON.parse(data);

    redis.set('recipe:' + data.compId, data.recipe, function (err) {
      if (err) {
        socket.emit('error', err);
      } else {
        loadRecipe(data.compId, true);
      }
    });
	});
});

console.log('listening at port: ' + port);
