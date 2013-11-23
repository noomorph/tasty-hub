/* global process, require, console */
var express = require('express'),
    port = process.env.PORT || 8000,
    app = express();

app.use(express.logger()).
    use(express.static('dist')).
    use(express.query()).
    use(express.bodyParser()).
    listen(port);

console.log('listening at port: ' + port);
