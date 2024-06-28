const path = require('path');

module.exports = {
  entry: './webClient.js',
  devtool: 'source-map',
  output: {
    filename: 'webClient.js',
    path: path.resolve(__dirname, 'dist'),
  },
};