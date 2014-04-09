# grunt-suitcss

> Build, preprocess and validate [SuitCSS](http://github.com/suitcss/suit) components

This task will build SuitCSS components using [component(1)](https://github.com/component/component), preprocess them and check for conformance.

**Build** - Dependencies are resolved and built using [component-resolver](https://github.com/component/resolver.js) and [component-build](https://github.com/component/build.js)

**Preprocess** - Components are pre-processed using [Suit CSS preprocessor](https://github.com/suitcss/preprocessor). This will run the file through [Autoprefixer](https://github.com/ai/autoprefixer) and allow usage of W3C-style variables and calc().

**Conform** - Components are checked for conformance with [Rework Suit Conformance](https://github.com/suitcss/rework-suit-conformance)

This plugin serves two audiences - those using SuitCSS components via Component and those wishing to just pre-process and validate normal CSS files that are written in SuitCSS style.

See the Options for details


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

#### options.resolveOpts
Type: `Object`
Default value: `{ install: true }`

Options that can be passed to the [component-resolver](https://github.com/component/resolver.js). 

**Note:** `verbose` is always set to true to allow output to the CLI

### Usage Examples

#### Default Options

##### Building SuitCSS components
In this example, the default options are used to build a SuitCSS component. The source file **must** be a `component.json` file for the task to know it has to fetch dependencies and build them. The resulting file is then passed through the SuitCSS preprocessor and conformance checker.

```js
grunt.initConfig({
  suitcss: {
    files: {
      'dest/built.css': 'path/to/component.json',
    },
  },
});
```

##### Preprocessing normal CSS files

It's nice to still write CSS as modular SuitCSS components even if component(1) is not used. In this case passing the task one or more CSS files will mean they are only pre-processed and checked for conformance.

```js
grunt.initConfig({
  suitcss: {
    files: {
      'dest/built.css': ['components/tweet.css', 'components/button.css'],
    },
  },
});
```

#### Custom Options
In this example, custom options are used to disable `preprocess`. If your components are written in Sass/LESS it might be useful to disable preprocessing of variables.

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

See [GitHub releases](https://github.com/simonsmith/grunt-suitcss/releases)
