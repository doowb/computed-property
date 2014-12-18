var info = require('../common').simple();
Object.defineProperty(info.obj, 'fullName', {
  get: info.fn
});
module.exports = function () {
  return info.obj.fullName;
};
