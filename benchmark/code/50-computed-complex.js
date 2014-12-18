var computedProperty = require('../../');
var info = require('../common').complex();
computedProperty(info.obj, 'assets', info.fn);

module.exports = function () {
  return info.obj.assets;
};
