module.exports = {
  mode: 'development',
  devtool: "source-map",
  entry: {
    index: './source/index',
    demo: './source/demo',
    "demo.min": './source/demo',
  },
  output: {
    filename: '[name].js',
    publicPath: 'dist/'
  },
  module: {
    rules: []
  }
};