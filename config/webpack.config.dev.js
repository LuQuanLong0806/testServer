const { merge } = require('webpack-merge');

const baseWebpackConfig = require('./webpack.config.base');

const webpackConfig = merge(baseWebpackConfig, {
  devtool: 'eval-source-map', // 调试模式
  mode: 'development',
  status: { children: false }
})

module.exports = webpackConfig