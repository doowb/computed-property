var computedProperty = require('../../');
var info = require('../common').complex();
computedProperty(info.obj, 'assets', ['dest.path'], info.fn);

module.exports = function () {
  return info.obj.assets;
};
