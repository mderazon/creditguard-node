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
  user: 'urbancaps',
  password: 'Urb@n0c!pSm',
  server: 'https://cguat2.creditguard.co.il',
  terminal: '0962832',
  mid: '523',
};



var tests = module.exports = {};

tests.bad_env = function(test) {
  var cg = creditguard(env_mock, { verbose: true });
  cg.call({}, function(err, res) {
    console.log(err);
    console.error(res);
    test.done();
  });
};
