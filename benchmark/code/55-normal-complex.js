var info = require('../common').complex();
Object.defineProperty(info.obj, 'assets', {
  get: info.fn
});

module.exports = function () {
  return info.obj.assets;
};
