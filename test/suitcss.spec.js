'use strict';

var grunt = require('grunt');
var expect = require('chai').expect;

describe('Pre-processing a stylesheet', function() {
  it('should process a SuitCSS component', function() {
    var actual = grunt.file.read('tmp/preprocess/built.css');
    var expected = grunt.file.read('test/expected/preprocess.css');

    expect(actual).to.equal(expected);
  });
});