var computedProperty = require('../../');
var info = require('../common').complex();
computedProperty(info.obj, 'assets', info.fn);

module.exports = function (name) {
  info.obj.dest.path = '_gh_pages';
  return info.obj.assets;
};
