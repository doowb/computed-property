/*!
 * computed-property <https://github.com/doowb/computed-property>
 *
 * Copyright (c) 2014-2017, Brian Woodward.
 * Released under the MIT License.
 */

'use strict';

var assert = require('assert');
var computedProperty = require('./');

describe('.computedProperty():', function() {
  it('should add a computed property to an object without dependencies.', function() {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', function() {
      return this.dirname + '/' + this.name + this.ext;
    });

    assert.equal(obj.path, 'views/home.hbs');
    obj.dirname = '_gh_pages';
    obj.ext = '.html';
    assert.equal(obj.path, '_gh_pages/home.html');
  });

  it('should add a computed property to an object with dependencies.', function() {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', ['ext', 'dirname'], function() {
      return this.dirname + '/' + this.name + this.ext;
    });

    assert.equal(obj.path, 'views/home.hbs');
    obj.dirname = '_gh_pages';
    obj.ext = '.html';
    assert.equal(obj.path, '_gh_pages/home.html');
  });

  it('should add a computed property to an object with deep dependencies.', function() {
    var obj = {
      name: {
        first: 'Brian',
        middle: 'G',
        last: 'Woodward'
      }
    };
    computedProperty(obj, 'fullname', ['name.first', 'name.last'], function() {
      return this.name.first + ' ' + this.name.last;
    });

    assert.equal(obj.fullname, 'Brian Woodward');
    obj.name.first = 'Bryan';
    assert.equal(obj.fullname, 'Bryan Woodward');
  });

  it('should add a computed property to an object with dependencies where a non dependency changes.', function() {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', ['ext', 'dirname'], function() {
      return this.dirname + '/' + this.name + this.ext;
    });

    assert.equal(obj.path, 'views/home.hbs');
    obj.name = 'foo';
    assert.equal(obj.path, 'views/home.hbs');
  });

  it('should add a computed property to an object with deep dependencies where a non dependency changes.', function() {
    var obj = {
      name: {
        first: 'Brian',
        middle: 'G',
        last: 'Woodward'
      }
    };
    computedProperty(obj, 'fullname', ['name.first', 'name.last'], function() {
      return this.name.first + ' ' + this.name.middle + '. ' + this.name.last;
    });
    assert.equal(obj.fullname, 'Brian G. Woodward');
    obj.name.middle = 'g';
    assert.equal(obj.fullname, 'Brian G. Woodward');
  });

  it('should re-copy values on first run', function() {
    var obj = {
      override: undefined,
      default: 'foo'
    };
    computedProperty(obj, 'thingy', ['override'], function() {
      return this.override || this.default;
    });
    obj.override = 'bar';
    assert.equal(obj.thingy, 'bar');
    obj.override = undefined;
    assert.equal(obj.thingy, 'foo');
  });
});
