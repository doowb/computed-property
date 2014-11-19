/*!
 * computed-property <https://github.com/doowb/computed-property>
 *
 * Copyright (c) 2014 Brian Woodward
 * Licensed under the MIT License (MIT)
 */

'use strict';

var should = require('should');
var computedProperty = require('./');

describe('.computedProperty():', function () {
  it('should add a computed property to an object without dependencies.', function () {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', function () {
      return this.dirname + '/' + this.name + this.ext;
    });

    obj.path.should.equal('views/home.hbs');
    obj.dirname = '_gh_pages';
    obj.ext = '.html';
    obj.path.should.equal('_gh_pages/home.html');
  });

  it('should add a computed property to an object with dependencies.', function () {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', ['ext', 'dirname'], function () {
      return this.dirname + '/' + this.name + this.ext;
    });

    obj.path.should.equal('views/home.hbs');
    obj.dirname = '_gh_pages';
    obj.ext = '.html';
    obj.path.should.equal('_gh_pages/home.html');
  });

  it('should add a computed property to an object with dependencies where a non dependency changes.', function () {
    var obj = {
      name: 'home',
      ext: '.hbs',
      dirname: 'views'
    };
    computedProperty(obj, 'path', ['ext', 'dirname'], function () {
      return this.dirname + '/' + this.name + this.ext;
    });

    obj.path.should.equal('views/home.hbs');
    obj.name = 'foo';
    obj.path.should.equal('views/home.hbs');
  });
});
