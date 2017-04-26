'use strict';

var HTTPBase = require('../lib/http/base');
var WSProxy = require('./wsproxy');
var fs = require('fs');
var server, proxy;

var index = fs.readFileSync(__dirname + '/index.html');
var indexjs = fs.readFileSync(__dirname + '/index.js');
var bcoin = fs.readFileSync(__dirname + '/bcoin.js');
var master = fs.readFileSync(__dirname + '/bcoin-master.js');
var worker = fs.readFileSync(__dirname + '/bcoin-worker.js');

proxy = new WSProxy({
  pow: process.argv.indexOf('--pow') !== -1,
  ports: [8333, 18333, 18444, 28333, 28901]
});

proxy.on('error', function(err) {
  console.error(err.stack + '');
});

server = new HTTPBase({
  port: +process.argv[2] || 8080,
  sockets: false
});

proxy.attach(server.server);

server.open();
