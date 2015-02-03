'use strict';

var gulp = require('gulp');
var webpack = require('gulp-webpack');
var path = require('path');
var del = require('del');

var conf = {
  context: __dirname,
  resolve: {
    extensions: ['', '.js'],
    root: [
      path.join(__dirname, '../..')
    ]
  },
  module: {
    loaders: [
      { test: /\.js$/, loader: 'jsx-loader?insertPragma=React.DOM' },
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
