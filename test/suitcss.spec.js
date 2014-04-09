'use strict';

var grunt = require('grunt');
var expect = require('chai').expect;

describe('Preprocessing stylesheets', function() {
  it('should preprocess a SuitCSS stylesheet', function() {
    var actual = grunt.file.read('tmp/preprocess/built.css');
    var expected = grunt.file.read('test/expected/preprocess.css');

    expect(actual).to.equal(expected);
  });
});

describe('Building components', function() {
  it('should build a SuitCSS component', function() {
    var actual = grunt.file.read('tmp/component/built.css');
    var expected = grunt.file.read('test/expected/component.css');

    expect(actual).to.equal(expected);
  });
});