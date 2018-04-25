const express = require('express'),
  proxy = require('http-proxy-middleware'),
  app = express(),
  url = 'http://nekopoi.faith',
  pmx = require('pmx'),
  probe = pmx.probe(),
  nekopi = {
    target: url,
    changeOrigin: true,
    ws: false,
    logLevel: 'silent'
  };

pmx.init({
  http : true,
  errors : true,
  custom_probes : true,
  network : true,
  ports : true
});

const count = probe.counter({
  name : 'Request Count',
  agg_type : 'sum'
});

app.use(function(req, res, next) {
  count.inc();
  next();
});

//
// Listen for the `error` event on `proxy`.
nekopi.onError = function (err, req, res) {
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });

  res.end('Opps. Maaf quota server mepet, silahkan buka dari mirror lain atau buka ' + url + '.');
};

// //
// // Listen for the `proxyRes` event on `proxy`.
// //
// nekopi.onProxyRes = function(proxyRes, req, res) {
  
// };

//
// Listen for the `close` event on `proxy`.
//
nekopi.onClose = function (res, socket, head) {
  // view disconnected websocket connections
  console.log('Client disconnected');
};

app.use(proxy(nekopi));

module.exports = app;