/*!
 * tcp.js - tcp backend for bcoin
 * Copyright (c) 2014-2017, Christopher Jeffrey (MIT License).
 * https://github.com/bcoin-org/bcoin
 */

'use strict';

var EventEmitter = require('events').EventEmitter;
var tcp = exports;

tcp.createSocket = function createSocket(port, host, proxy) {
  return net.createConnection(port, host);
};

tcp.createServer = function createServer() {
  var server = new EventEmitter();

  server.listen = function listen(port, host) {
    server.emit('listening');
    return Promise.resolve();
  };

  server.close = function close() {
    return Promise.resolve();
  };

  server.address = function address() {
    return {
      address: '127.0.0.1',
      port: 0
    };
  };

  server.maxConnections = undefined;

  return server;
};
