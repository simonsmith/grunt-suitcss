# grunt-suitcss [![Build Status](https://travis-ci.org/simonsmith/grunt-suitcss.svg?branch=master)](https://travis-ci.org/simonsmith/grunt-suitcss) ![unmaintained](http://img.shields.io/badge/status-unmaintained-red.png)

> Preprocess and validate [SUIT CSS](http://github.com/suitcss/suit) components

This task will build CSS components via the SUIT CSS [preprocessor](http://github.com/suitcss/preprocessor)

## Getting Started
This plugin requires Grunt `~0.4.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-suitcss --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-suitcss');
```

## SUIT CSS task

### Overview
In your project's Gruntfile, add a section named `suitcss` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  suitcss: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.conform
Type: `Boolean`
Default value: `true`

Pass each component through the [Rework Suit Conformance](https://github.com/suitcss/rework-suit-conformance) library. If conformance fails an error will be output to the CLI and the task will be stopped

#### options.resolveOpts
Type: `Object`
Default value: `{ install: true }`

Options that can be passed to the [component-resolver](https://github.com/component/resolver.js).

**Note:** `verbose` is always set to true to allow output to the CLI

#### options.preprocessOpts
Type: `Object`
Default value: `{}`

Options that can be passed to the [SUIT CSS preprocessor](https://github.com/suitcss/preprocessor)

### Usage Examples

**Note: Working examples can be found in the `/test` directory**

#### Building components with import

The SUIT preprocesser makes use of [rework-npm](https://github.com/reworkcss/rework-npm) to allow importing of dependencies from npm or local folders. Pass the task a file with imports and they will be resolved.  This method is the favoured approach to building components.

```js
grunt.initConfig({
  suitcss: {
    your_target: {
      files: {
        'dest/built.css': ['suit_components/main.css'],
      }
    }
  }
});
```

#### Building SUIT CSS components with component(1)
In this example, the default options are used to build a SUIT CSS component. The source file **must** be a `component.json` file for the task to know it has to fetch dependencies and build them. Each component is passed through the conformance checker and the resulting file is then passed through the SUIT CSS preprocessor.

```js
grunt.initConfig({
  suitcss: {
    your_target: {
      files: {
        'dest/built.css': 'path/to/component.json',
      }
    }
  },
});
```

#### Preprocessing normal CSS files

It's possible to use SUIT CSS components even if component(1) or rework-npm are not used, for example installing them from a different package manager like Bower. In this case passing the task one or more CSS files will mean they are checked for conformance individually and then preprocessed as a complete package. They are built in the order they are passed in.

```js
grunt.initConfig({
  suitcss: {
    your_target: {
      files: {
        'dest/built.css': ['components/tweet.css', 'components/button.css'],
      }
    }
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

See [GitHub releases](https://github.com/simonsmith/grunt-suitcss/releases)
