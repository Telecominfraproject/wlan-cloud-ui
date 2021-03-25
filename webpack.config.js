/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require('webpack-merge');
const common = require('./webpack/webpack.common');

const envs = {
  development: 'dev',
  production: 'prod',
  bare: 'bare',
};
/* eslint-disable global-require,import/no-dynamic-require */
const env = envs[process.env.NODE_ENV || 'production'];
const envConfig = require(`./webpack/webpack.${env}.js`);
module.exports = merge(common, envConfig);
