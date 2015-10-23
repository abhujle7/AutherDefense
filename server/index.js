'use strict';
var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync(__dirname + '/sslcert/key.pem', 'utf8');
var certificate = fs.readFileSync(__dirname + '/sslcert/cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

var app = require('./app'),
	db = require('./db');

var httpsServer = https.createServer(credentials, app);

var port = 8080;
var server = httpsServer.listen(port, function () {
	console.log('HTTPS server patiently listening on port', port);
});

module.exports = server;