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
            loader: 'less-loader',
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: commonPaths.templatePath,
      favicon: './app/images/favicon.ico',
    }),
    new webpack.DefinePlugin({
      'process.env.GRAPHQL_URL': JSON.stringify(process.env.GRAPHQL_URL),
    }),
  ],
};
