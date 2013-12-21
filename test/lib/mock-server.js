var express = require('express');
var xml2js = require('xml2js');
var jsonxml = require('jsontoxml');

var parser_opts = {
  emptyTag: undefined,
  ignoreAttrs: true,
  explicitArray: false,
  explicitRoot: false,
};

var xmljson = new xml2js.Parser(parser_opts).parseString;

var env = {
  address: 'http://localhost:6000',
  terminal: '1234567',
  mid: '123',
  username: 'user',
  password: 'pass',
};

exports.get_server = function() {

  var app = express();

  app.use(express.bodyParser());

  app.post('/xpo/Relay', function(req, res) {
    // TODO need to emulate cg server
  });

  // start the mock cg server on port 6000
  app.port = 6000;
  app.listen(app.port);



  return app;
};

exports.address = env.address;
exports.terminal = env.terminal;
exports.mid = env.mid;
exports.username = env.username;
exports.password = env.password;

