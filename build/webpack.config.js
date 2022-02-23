module.exports = {
  mode: 'production',
  entry: {
    global: './source/global'
  },
  output: {
    filename: '[name].js',
    publicPath: 'dist/'
  }
};