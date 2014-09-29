'use strict';

var grunt = require('grunt');
var expect = require('chai').expect;

describe('Preprocessing stylesheets', function() {
  runTest('should resolve imports - relative and via npm', 'tmp/import/built.css', 'test/expected/import.css');
  runTest('should preprocess a collection of stylesheets', 'tmp/preprocess/built.css', 'test/expected/preprocess.css');
  runTest('should resolve dependencies and build with Component(1)', 'tmp/component/built.css', 'test/expected/component.css');
});

function runTest(description, actualPath, expectedPath) {
  it(description, function() {
    expect(grunt.file.read(actualPath)).to.equal(grunt.file.read(expectedPath));
  });
}