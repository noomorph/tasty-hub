if (process.env.REDISTOGO_URL) {
    var rtg   = require("url").parse(process.env.REDISTOGO_URL);
    var redis = require("redis").createClient(rtg.port, rtg.hostname);
    redis.auth(rtg.auth.split(":")[1]); 
} else {
    var redis = require("redis").createClient();
}

redis.on("error", function (err) {
    console.log("Error " + err);
});

var express = require('express'),
    fbVerify = require('./lib/fb-verify'),
    port = process.env.PORT || 3000,
    appId = '188996117830571',
    app = express().
              use(express.logger()).
              use(express.static('app')).
              use(express.query()).
              use(express.bodyParser()).
              get('/lists', function (req, res) {
                  var identity = fbVerify(req.query.signedRequest, appId);

                  if (!identity || typeof identity === "string") {
                      return res.send(401, identity || undefined);
                  }

                  redis.get(identity.user_id, function (err, lists) {
                      if (err) {
                          res.json(500, err);
                      } else {
                          res.json(JSON.parse(lists || '[]'));
                      }
                  });
              }).
              put('/lists', function (req, res) {
                  var identity = fbVerify(req.query.signedRequest, appId);

                  if (!identity || typeof identity === "string") {
                      return res.send(401, identity || undefined);
                  }

                  redis.set(identity.user_id, JSON.stringify(req.body), function (err) {
                      if (err) {
                          res.json(500, err);
                      } else {
                          res.send(200);
                      }
                  });
              }).
              listen(port);

console.log('listening at port: ' + port);


