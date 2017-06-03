/*!
 * computed-property <https://github.com/doowb/computed-property>
 *
 * Copyright (c) 2014-2017, Brian Woodward.
 * Released under the MIT License.
 */

'use strict';

var cloneDeep = require('lodash.clonedeep');
var get = require('get-value');
var set = require('set-object');

/**
 * Determine if dependencies have changed.
 *
 * @param  {Object}  `depValues` Stored dependency values
 * @param  {Object}  `current` Current object to check the dependencies.
 * @param  {Array}   `dependencies` Dependencies to check.
 * @return {Boolean} Did any dependencies change?
 * @api private
 */

function hasChanged (depValues, current, dependencies) {
  var len = dependencies.length;
  var i = 0;
  var result = false;
  while (len--) {
    var dep = dependencies[i++];
    var value = get(current, dep);
    if (get(depValues, dep) !== value) {
      result = true;
      set(depValues, dep, value);
    }
  }
  return result;
}

/**
 * Setup the storage object for watching dependencies.
 *
 * @param  {Object}  `obj`          Object property is being added to.
 * @param  {Object}  `depValues`    Object used for storage.
 * @param  {Array}   `dependencies` Dependencies to watch
 * @return {Boolean} Return if watching or not.
 * @api private
 */

function initWatch (obj, depValues, dependencies) {
  var len = dependencies.length;
  if (len === 0) {
      return false;
  }
  var i = 0;
  while (len--) {
      var dep = dependencies[i++];
      var value = cloneDeep(get(obj, dep));
      set(depValues, dep, value);
  }
  return true;
}

/**
 * Add a computed property to an object. This updates
 * the property when dependent properties are updated.
 *
 * ```js
 * var computedProperty = require('computed-property');
 * var file = {
 *   name: 'home-page',
 *   ext: '.hbs',
 *   dirname: 'views',
 *   data: {
 *     title: 'Home'
 *   }
 * };
 *
 * computedProperty(
 *   // object
 *   file,
 *   // property name
 *   'path',
 *   // optional dependencies (may be deeply nested)
 *   ['name', 'ext', 'dirname', 'data.title'],
 *   // getter function
 *   function () {
 *     return this.dirname + '/' + this.name + this.ext;
 *   });
 * ```
 *
 * @param  {Object}   `obj` Object to add the property to.
 * @param  {String}   `property` Name of the property.
 * @param  {Array}    `dependencies` Optional list of properties to depend on.
 * @param  {Function} `getter` Getter function that does the calculation.
 * @api public
 * @name  computedProperty
 */

module.exports = function computedProperty (obj, property, dependencies, getter) {
  if (typeof dependencies === 'function') {
    getter = dependencies;
    dependencies = [];
  }
  if (typeof getter !== 'function') {
    throw new TypeError('Expected `getter` to be a function but got ' + typeof getter);
  }

  dependencies = [].concat.apply([], dependencies);
  var depValues = {};
  var isWatching = initWatch(obj, depValues, dependencies);
  var wasComputed = false;
  var computed;

  Object.defineProperty(obj, property, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (!wasComputed) {
        hasChanged(depValues, this, dependencies);
        computed = getter.call(this);
        wasComputed = true;
      } else if (!isWatching || hasChanged(depValues, this, dependencies)) {
        computed = getter.call(this);
      }
      return computed;
    },
    set: function () {
        throw new TypeError('"' + property + '" is a computed property, it can\'t be set directly.');
    }
  });
};
