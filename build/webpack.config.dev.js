module.exports = {
  mode: 'development',
  devtool: "eval-source-map",
  entry: {
    index: './source/index',
    demo: './source/demo',
    global: './source/global'
  },
  output: {
    filename: '[name].js',
    publicPath: 'dist/'
  },
  module: {
    rules: []
  }
};