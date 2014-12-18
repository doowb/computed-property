var info = require('../common').simple();
Object.defineProperty(info.obj, 'fullName', {
  get: info.fn
});
module.exports = function () {
  info.obj.first = 'Jon';
  info.obj.last = 'Schlinkert';
  return info.obj.fullName;
};
