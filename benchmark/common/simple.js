
module.exports = function () {
  return {
    obj: {
      first: 'Brian',
      last: 'Woodward'
    },
    fn: function () {
      return this.first + ' ' + this.last;
    }
  };
};
