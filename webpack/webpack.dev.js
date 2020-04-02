const path = require('path');

const commonPaths = require('./paths');

module.exports = {
  output: {
    path: commonPaths.outputPath,
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].js',
  },
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    historyApiFallback: true,
    contentBase: commonPaths.outputPath,
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[name]__[local]___[hash:base64:5]',
              },
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      'app',
      path.resolve(__dirname, '../', 'node_modules', 'cu-ui', 'src'),
    ],
    alias: {
      app: path.resolve(__dirname, '../', 'app'),
      react: path.resolve(__dirname, '../', 'node_modules', 'react'),
      'cu-ui': path.resolve(__dirname, '../', 'node_modules', 'cu-ui', 'src'),
    },
  },
};
