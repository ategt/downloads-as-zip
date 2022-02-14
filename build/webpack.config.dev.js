'use strict'

module.exports = {
  mode: 'development',
  devtool: "eval-source-map",
  entry: {
    index: './source/index',
    demo: './source/demo',
  },
  output: {
    filename: '[name].js',
    publicPath: 'dist/'
  },
  module: {
    rules: []
  }
};