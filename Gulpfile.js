'use strict';

var gulp = require('gulp');
var rename = require('gulp-rename');
var react = require('gulp-react');
var webpack = require('gulp-webpack');
var realWebpack = require('webpack');
var path = require('path');
var del = require('del');
var extend = require('extend');

var commonConf = function(additions) {
  return extend(true, {
    context: __dirname,
    resolve: {
      extensions: ['', '.js']
    },
    module: {
      loaders: [
        { test: /\.jsx$/, loader: 'jsx-loader?insertPragma=React.DOM' }
      ]
    },
    externals: {
      'react/addons': "React"
    },
    plugins: []
  }, additions)
};

gulp.task('build:browser', function() {
  gulp.src('src/Sortable.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'Sortable.js',
        library: "Sortable",
        libraryTarget: "var"
      }
    })))
    .pipe(gulp.dest('dist'));
  gulp.src('src/Sortable.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'Sortable.min.js',
        library: "Sortable",
        libraryTarget: "var"
      },
      plugins: [
        new realWebpack.DefinePlugin({
              "process.env": {
                "NODE_ENV": JSON.stringify('production')
              }
            }),
        new realWebpack.optimize.DedupePlugin(),
        new realWebpack.optimize.UglifyJsPlugin()
      ]
    })))
    .pipe(gulp.dest('dist'));
  gulp.src('src/SortableItemMixin.jsx')
      .pipe(webpack(commonConf({
        output: {
          filename: 'SortableItemMixin.js',
          library: "SortableItemMixin",
          libraryTarget: "var"
        }
      })))
      .pipe(gulp.dest('dist'));
  gulp.src('src/SortableItemMixin.jsx')
    .pipe(webpack(commonConf({
      output: {
        filename: 'SortableItemMixin.min.js',
        library: "SortableItemMixin",
        libraryTarget: "var"
      },
      plugins: [
        new realWebpack.DefinePlugin({
              "process.env": {
                "NODE_ENV": JSON.stringify('production')
              }
            }),
        new realWebpack.optimize.DedupePlugin(),
        new realWebpack.optimize.UglifyJsPlugin()
      ]
    })))
    .pipe(gulp.dest('dist'));
});

gulp.task('build:node', function() {
  gulp.src('src/Sortable.jsx')
    .pipe(react())
    .pipe(rename('Sortable.js'))
    .pipe(gulp.dest(''));

  gulp.src('src/SortableItemMixin.jsx')
    .pipe(react())
    .pipe(rename('SortableItemMixin.js'))
    .pipe(gulp.dest(''));
});

gulp.task('build', ['build:node', 'build:browser']);

gulp.task('clean', function(cb) {
  del(['dist', 'Sortable.js', 'SortableItemMixin.js'], cb);
});

gulp.task('default', ['build']);
