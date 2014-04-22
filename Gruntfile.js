/*
 * grunt-suitcss
 * https://github.com/simonsmith/grunt-suitcss
 *
 * Copyright (c) 2014 Simon Smith
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
      tests: ['tmp', 'components']
    },

    suitcss: {
      file: {
        files: {
          'tmp/preprocess/built.css': [
            'test/fixtures/preprocess/button.css',
            'test/fixtures/preprocess/grid.css',
            'test/fixtures/preprocess/theme.css'
          ]
        }
      },
      component: {
        files: {
          'tmp/component/built.css': 'test/fixtures/component/component.json'
        }
      }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/*.spec.js']
      }
    }

  });

  grunt.loadTasks('tasks');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'suitcss', 'mochaTest']);

  grunt.registerTask('default', ['jshint', 'test']);
};
