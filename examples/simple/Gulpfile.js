'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack');
var path = require('path');
var del = require('del');

var conf = {
  context: __dirname,
  resolve: {
    alias: {
      'react-sortable-items$': __dirname + '/../../src/Sortable',
      'react-sortable-items/style.css': __dirname + '/../../style.css',
      'react-sortable-items': __dirname + '/../../src'
    },
    extensions: ['', '.js', '.jsx'],
    root: [
      path.join(__dirname, '../..')
    ]
  },
  module: {
    loaders: [
      { test: /\.js(x)?/, loader: 'jsx-loader?insertPragma=React.DOM' },
      {
        test: /\.css$/,
        loader: "style!css"
      }
    ]
  },
  output: {
    filename: 'main.js'
  },
  plugins: []
};

gulp.task('build', function() {
  return gulp.src('main.js')
    .pipe(webpack(conf))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function(cb) {
  del('dist', cb);
});

gulp.task('default', ['build']);
