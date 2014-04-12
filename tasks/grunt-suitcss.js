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
var flatten     = require('component-flatten');
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
      Q.all(files).then(function(files) {
        preprocessAndWriteFile(f.dest, files);
      })
      .catch(failTask)
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
 * If file is .json then assume we need to build a component
 * Otherwise just check the files for conformance
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function getFileContents(filepath) {
  if (isComponent(filepath)) {
    return buildComponentAndCheckConformance(filepath);
  } else {
    return checkConformance(filepath);
  }
}

/**
 * Builds a component package based on a component.json file.
 * Will install packages if they don't exist locally.
 * Validate each component before returning built file
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function buildComponentAndCheckConformance(filepath) {
  var componentDir = path.join(process.cwd(), path.dirname(filepath));
  var deferred = Q.defer();

  resolve(componentDir, options.resolveOpts, function(err, tree) {
    if (err) {
      deferred.reject(err);
      return;
    }

    var build = Build(flatten(tree));

    build.stylePlugins = function(build) {
      if (options.conform) {
        build.use('styles', function(file, done) {
          file.read(function(err, string) {
            if (err) {
              deferred.reject(err);
              return;
            }
            file.string = conform(string);
            done();
          });
        });
      }
    };

    build.styles(function(err, string) {
      if (err) {
        deferred.reject(err);
        return;
      }
      if (!string) {
        deferred.reject('The styles could not be built');
        return;
      }

      deferred.resolve(string);
    });
  });

  return deferred.promise;
}

/**
 * Check Suit files for conformance. Run on individual components
 *
 * @param filepath
 * @returns {promise|Q.promise}
 */
function checkConformance(filepath) {
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

  deferred.resolve(file);
  return deferred.promise;
}

/**
 * @param filepath
 * @returns {boolean}
 */
function isComponent(filepath) {
  return /component.json$/.test(filepath);
}

/**
 * @param string
 * @returns {String}
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
 * @param files
 */
function preprocessAndWriteFile(dest, files) {
  if (options.preprocess) {
    files = files.map(preprocess);
  }

  grunt.file.write(dest, files.join(grunt.util.normalizelf(options.separator)));
  grunt.log.writeln('File "' + dest + '" created.');
}

/**
 * @param error
 */
function failTask(error) {
  grunt.fail.fatal(error);
}