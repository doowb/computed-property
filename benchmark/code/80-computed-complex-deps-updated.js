var computedProperty = require('../../');
var info = require('../common').complex();
computedProperty(info.obj, 'assets', ['dest.path'], info.fn);

module.exports = function () {
  info.obj.dest.path = '_gh_pages';
  return info.obj.assets;
};
