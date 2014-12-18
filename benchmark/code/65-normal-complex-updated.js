var info = require('../common').complex();
Object.defineProperty(info.obj, 'assets', {
  get: info.fn
});

module.exports = function () {
  info.obj.dest.path = '_gh_pages';
  return info.obj.assets;
};
