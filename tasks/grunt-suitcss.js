/*
 * grunt-suitcss
 * Build, preprocess and validate SUIT CSS components
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

  grunt.registerMultiTask('suitcss', 'Preprocess and validate SUIT CSS components', function() {
    options = this.options({
      separator: grunt.util.linefeed,
      conform: true,
      resolveOpts: {
        install: true
      },
      preprocessOpts: {}
    });

    // Ensure always verbose for CLI output
    options.resolveOpts.verbose = true;

    var taskDone = this.async();

    this.files.forEach(function(f) {
      var files = f.src.filter(checkFileExists).map(getFileContents);

      Q.all(files)
        .done(function(files) {
          writeFile(f.dest, files);
          taskDone();
        }, failTask);
    });
  });

};

function checkFileExists(filepath) {
  if (!grunt.file.exists(filepath)) {
    grunt.log.warn('Source file "' + filepath + '" not found.');
    return false;
  } else {
    return true;
  }
}

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
 * Validate each component before returning built files
 */
function buildComponentAndCheckConformance(filepath) {
  var componentDir = path.join(process.cwd(), path.dirname(filepath));
  var deferred = Q.defer();

  resolve(componentDir, options.resolveOpts, function(err, tree) {
    if (err) {
      return deferred.reject(err);
    }

    var build = Build(flatten(tree));

    build.stylePlugins = function(build) {
      build.use('styles', function(file, done) {
        file.read(function(err, string) {
          if (err) {
            return deferred.reject(err);
          }

          if (options.conform) {
            try {
              file.string = conform(string);
            } catch (e) {
              return deferred.reject(e);
            }
          }

          done();
        });
      });
    };

    build.styles(function(err, builtCSS) {
      if (err) {
        return deferred.reject(err);
      }

      deferred.resolve(builtCSS);
    });
  });

  return deferred.promise;
}

/**
 * Run on individual components
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

function isComponent(filepath) {
  return /component.json$/.test(filepath);
}

function conform(string) {
  return rework(string).use(conformance);
}

function writeFile(dest, files) {
  var file = files.join(grunt.util.normalizelf(options.separator));

  file = suitcss(file, options.preprocessOpts);

  grunt.file.write(dest, file);
  grunt.log.writeln('File "' + dest + '" created.');
}

function failTask(error) {
  grunt.fail.fatal(error);
}