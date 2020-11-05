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
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      'node_modules',
      'app',
      path.resolve(__dirname, '../', 'node_modules', '@tip-wlan', 'wlan-cloud-ui-library', 'src'),
    ],
    alias: {
      app: path.resolve(__dirname, '../', 'app'),
      react: path.resolve(__dirname, '../', 'node_modules', 'react'),
      'react-router-dom': path.resolve('./node_modules/react-router-dom'),
      '@tip-wlan/wlan-cloud-ui-library': path.resolve(
        __dirname,
        '../',
        'node_modules',
        '@tip-wlan',
        'wlan-cloud-ui-library',
        'src'
      ),
    },
  },
};
