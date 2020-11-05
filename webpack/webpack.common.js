const HtmlWebPackPlugin = require('html-webpack-plugin');
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

const commonPaths = require('./paths');

module.exports = {
  mode: process.env.NODE_ENV,
  entry: ['babel-polyfill', commonPaths.entryPath],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: commonPaths.templatePath,
      favicon: './app/images/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env.API': JSON.stringify(process.env.API || 'http://localhost:4000'),
    }),
  ],
};
