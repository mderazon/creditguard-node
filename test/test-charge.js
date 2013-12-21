var creditguard = require('../lib/creditguard');
var mock_server = require('./lib/mock-server');

var server = mock_server.get_server();

var env_mock = {
  user: mock_server.username,
  password: mock_server.password,
  server: mock_server.address,
  terminal: mock_server.terminal,
  mid: mock_server.mid,
};

var env_testing = {
  user: process.env.CG_USER,
  password: process.env.CG_PASS,
  server: 'cguat2.creditguard.co.il',
  terminal: process.env.CG_TERMINAL,
  mid: process.env.CG_MID,
};


var tests = module.exports = {};

tests.bad_env = function(test) {
  var cg = creditguard(env_testing, { verbose: true });
  cg.call({}, function(err, res) {
    test.done();
  });
};
