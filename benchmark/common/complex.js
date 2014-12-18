
var calcAssets = require('calculate-assets');

module.exports = function () {
  return {
    obj: {
      dest: {
        path: 'src/templates'
      },
      _assets: '_gh_pages/assets'
    },
    fn: function () {
      return calcAssets(this.dest.path, this._assets);
    }
  };
};
