/*!
 * computed-property <https://github.com/doowb/computed-property>
 *
 * Copyright (c) 2014 Brian Woodward, contributors.
 * Licensed under the MIT license.
 */

'use strict';

var cloneDeep = require('lodash.clonedeep');
var get = require('get-value');
var set = require('set-object');

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
 * @param  {Function} `name` Name of the property.
 * @param  {Array}    `dependencies` Optional list of properties to depend on.
 * @param  {Function} `getter` Getter function that does the calculation.
 * @api public
 * @name  computedProperty
 */

module.exports = function computedProperty (obj, name, dependencies, getter) {
  if (typeof dependencies === 'function') {
    getter = dependencies;
    dependencies = [];
  }
  if (typeof getter !== 'function') {
    throw new Error('Expected `getter` to be a function but got ' + typeof getter);
  }

  dependencies = [].concat.apply([], dependencies);
  var prev = {};
  prev[name] = undefined;
  var watch = initWatch(obj, prev, dependencies);

  Object.defineProperty(obj, name, {
    configurable: true,
    enumerable: true,
    get: function () {
      if (!watch || prev[name] == undefined || changed(prev, this, dependencies)) {
        prev[name] = getter.call(this);
      }
      return prev[name];
    },
    set: function () { }
  });
};

/**
 * Setup the storage object for watching dependencies.
 *
 * @param  {Object}  `obj`          Object property is being added to.
 * @param  {Object}  `prev`         Object used for storage.
 * @param  {Array}   `dependencies` Dependencies to watch
 * @return {Boolean} Return if watching or not.
 * @api private
 */

function initWatch (obj, prev, dependencies) {
  var watch = false;
  var len = dependencies.length;
  if (len > 0) {
    watch = true;
    var i = 0;
    while (len--) {
      var dep = dependencies[i++];
      var value = cloneDeep(get(obj, dep));
      set(prev, dep, value);
    }
  }
  return watch;
}

/**
 * Determine if dependencies have changed.
 *
 * @param  {Object}  `prev` Stored dependency values
 * @param  {Object}  `current` Current object to check the dependencies.
 * @param  {Array}   `dependencies` Dependencies to check.
 * @return {Boolean} Did any dependencies change?
 * @api private
 */

function changed (prev, current, dependencies) {
  var len = dependencies.length;
  var i = 0;
  var result = false;
  while (len--) {
    var dep = dependencies[i++];
    var value = get(current, dep);
    if (get(prev, dep) !== value) {
      result = true;
      set(prev, dep, value);
    }
  }
  return result;
}
