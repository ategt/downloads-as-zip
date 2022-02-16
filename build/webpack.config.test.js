const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dev = require("./webpack.config.dev");

module.exports = {
  ...dev,
  devtool: "source-map",
  entry: {
    test: './source/tests'
  },
  output: {
    filename: '[name].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'css-unicode-loader',
          'style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
  	new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      title: 'Born To Code Tests',
      filename: 'test.html',
      template: 'source/test-assets/templates/tests.html',
      chunks: ['test'],
    })  	
  ]
};