var Suite = require('benchmarked');
var suite = new Suite({
  cwd: 'benchmark',
  add: 'code/*.js',
  fixtures: 'fixtures/*.js',
  result: true
});

suite.run();
