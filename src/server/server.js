var path = require('path');
var express = require('express');
var redirectToHTTPS = require('express-http-to-https');

var config = require('./config');
var serveFrom = path.join(__dirname, '../client');

var app = express();
app.use(redirectToHTTPS.redirectToHTTPS([/localhost:(\d{4})/]));
app.use(express.static(serveFrom));
app.get('*', function(req, res) {
    res.sendFile(path.join(serveFrom, 'index.html'));
});

var server = app.listen(config.port, function() {
    console.info('Server listening on port ' + config.port);
});

module.exports = server;
