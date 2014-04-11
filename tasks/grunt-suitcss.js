/*
 * grunt-suitcss
 * Build, preprocess and validate SuitCSS components
 * https://github.com/simonsmith/grunt-suitcss
 *
 * Copyright (c) 2014 Simon Smith
 * Licensed under the MIT license.
 */

'use strict';

var path        = require('path');
var rework      = require('rework');
var conformance = require('rework-suit-conformance');
var suitcss     = require('suitcss-preprocessor');
var resolve     = require('component-resolver');
var Build       = require('component-build');
var Q           = require('q');
var grunt       = require('grunt');

var options;
module.exports = function() {

  grunt.registerMultiTask('suitcss', 'Preprocess and validate SuitCSS components', function() {
    options = this.options({
      separator: grunt.util.linefeed,
      conform: true,
      preprocess: true,
      resolveOpts: {
        install: true
      }
    });

    // Ensure always verbose for CLI output
    options.resolveOpts.verbose = true;

    // Fetching components can take a while so
    // async is necessary.
    var taskDone = this.async();

    this.files.forEach(function(f) {
      var files = f.src
          .filter(checkFileExists)
          .map(getFileContents);

      // Wait for promises to resolve and then write contents
      // to file.
      Q.all(files).then(function(file) {
        writeFile(f.dest, file);
      }, failTask)
      .finally(taskDone);
    });
  });

};

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
 * If file is .json then assume we need to build and process a component
 * Otherwise just preprocess the files as single Suit css files
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function getFileContents(filepath) {
  if (isComponent(filepath)) {
    return buildComponentsAndPreprocessSuit(filepath);
  } else {
    return preprocessSuit(filepath);
  }
}

/**
 * Builds a component package based on a component.json file.
 * Will install packages if they don't exist locally.
 * Validate and preprocess the Suit components once installed
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function buildComponentsAndPreprocessSuit(filepath) {
  var componentDir = path.join(process.cwd(), path.dirname(filepath));
  var deferred = Q.defer();

  resolve(componentDir, options.resolveOpts, function(err, tree) {
    if (err) {
      deferred.reject(err);
      return deferred.promise;
    }

    var build = Build(tree);

    build.styles(function(err, string) {
      if (err) {
        deferred.reject(err);
        return;
      }
      if (!string) {
        deferred.reject('The styles could not be built');
        return;
      }

      if (options.conform) {
        try {
          conform(string);
        } catch (e) {
          deferred.reject(e);
          return deferred.promise;
        }
      }

      if (options.preprocess) {
        string = preprocess(string);
      }

      deferred.resolve(string);
    });
  });

  return deferred.promise;
}

/**
 * Preprocess and validate SuitCSS files
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function preprocessSuit(filepath) {
  var file = grunt.file.read(filepath);
  var deferred = Q.defer();

  if (options.conform) {
    try {
      conform(file);
    } catch (e) {
      deferred.reject(e);
      return deferred.promise;
    }
  }

  if (options.preprocess) {
    file = preprocess(file);
  }

  deferred.resolve(file);
  return deferred.promise;
}

/**
 * @param filepath
 * @returns {boolean|*}
 */
function isComponent(filepath) {
  return /component.json$/.test(filepath);
}

/**
 * @param string
 */
function conform(string) {
  return rework(string).use(conformance);
}

/**
 * @param string
 * @returns {String}
 */
function preprocess(string) {
  return suitcss(string);
}

/**
 * @param dest
 * @param file
 */
function writeFile(dest, file) {
  grunt.file.write(dest, file.join(grunt.util.normalizelf(options.separator)));
  grunt.log.writeln('File "' + dest + '" created.');
}

/**
 * @param error
 */
function failTask(error) {
  grunt.fail.fatal(error);
}