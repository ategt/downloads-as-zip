const dev = require("./webpack.config.dev");

module.exports = {
  ...dev,
  devtool: "source-map",
  entry: {
    tape: './source/index.tape'
  },
};