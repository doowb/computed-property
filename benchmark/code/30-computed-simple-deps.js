
var computedProperty = require('../../');
var info = require('../common').simple();

computedProperty(info.obj, 'fullName', ['first', 'last'], info.fn);

module.exports = function () {
  return info.obj.fullName;
};
