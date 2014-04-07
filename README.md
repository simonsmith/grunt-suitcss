# grunt-suitcss

> Preprocess and validate [SuitCSS](http://github.com/suitcss/suit) components

This task is basically a wrapper around [Rework Suit Conformance](https://github.com/suitcss/rework-suit-conformance) and [Suit CSS preprocessor](https://github.com/suitcss/preprocessor).

Use it to validate conformance of SuitCSS components, usage of W3C variables and passing CSS through [Autoprefixer](https://github.com/ai/autoprefixer)

## Getting Started
This plugin requires Grunt `~0.4.4`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-suitcss --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-suitcss');
```

## Suitcss task

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

Pass the CSS file through the [Rework Suit Conformance](https://github.com/suitcss/rework-suit-conformance) library. If conformance fails an error will be output to the CLI and the task will be stopped

#### options.preprocess
Type: `Boolean`
Default value: `true`

Pass the CSS file through the [Suit CSS preprocessor](https://github.com/suitcss/preprocessor)

### Usage Examples

#### Default Options
In this example, the default options are used to do process the file with SuitCSS conformance and also pre-process variables and prefixed properties

```js
grunt.initConfig({
  suitcss: {
    options: {},
    files: {
      'dest/built.css': ['components/tweet.css', 'components/button.css'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to disable `preprocess`. If your components are written in Sass/LESS it might be useful to disable preprocessing of variables. Or another part of your build task could already be handling this.

**Note** If both `conform` and `preprocess` are set to false then `grunt-suitcss` will simply return the untouched CSS.

```js
grunt.initConfig({
  suitcss: {
    options: {
      preprocess: false,
    },
    files: {
      'dest/built.css': ['components/tweet.css', 'components/button.css'],
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

See [GitHub releases](https://github.com/gruntjs/grunt-suitcss/releases)
