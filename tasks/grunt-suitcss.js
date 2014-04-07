/*
 * grunt-suitcss
 * https://github.com/simonsmith/grunt-suitcss
 *
 * Copyright (c) 2014 Simon Smith
 * Licensed under the MIT license.
 */

'use strict';

var rework      = require('rework');
var conformance = require('rework-suit-conformance');
var suitcss     = require('suitcss-preprocessor');

module.exports = function(grunt) {
  var options;

  grunt.registerMultiTask('suitcss', 'Preprocess and validate SuitCSS components', function() {
    options = this.options({
      separator: grunt.util.linefeed,
      conform: true,
      preprocess: true
    });

    this.files.forEach(function(f) {
      var src = f.src
          .filter(checkFileExists)
          .map(parseCSSFile)
          .join(grunt.util.normalizelf(options.separator));

      grunt.file.write(f.dest, src);

      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

  /**
   * @param filepath
   * @returns {boolean}
   */
  function checkFileExists(filepath) {
    if (!grunt.file.exists(filepath)) {
      grunt.log.warn('Source file "' + filepath + '" not found.');
      return false;
    } else {
      return true;
    }
  }

  /**
   * @param filepath
   * @returns {*}
   */
  function parseCSSFile(filepath) {
    var file = grunt.file.read(filepath);

    if (options.conform) {
      checkSuitConformance(file);
    }

    if (options.preprocess) {
      file = preprocessCSS(file);
    }

    return file;
  }

  /**
   * @param file
   */
  function checkSuitConformance(file) {
    rework(file).use(conformance);
  }

  /**
   * @param file
   * @returns {String}
   */
  function preprocessCSS(file) {
    return suitcss(file);
  }

};
