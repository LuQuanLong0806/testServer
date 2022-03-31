const { merge } = require('webpack-merge');

const baseWebpackConfig = require('./webpack.config.base')

const TerserWebpackPlugin = require('terser-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  stats: { children: false, warnings: false },
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          warnings: false,
          compress: {
            warnings: false,
            drop_console: false,
            // drop_code: true,
            drop_debugger: true,
          },
          // module: false,
          // Deprecated
          output: {
            comments: false,
            beautify: false
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
        },
        parallel: true,
        // sourceMap: false,
      })
    ],
    splitChunks: {
      chunks: 'initial',
      cacheGroups: {
        // vendors: {
        //   test: /[\\/]node_modules[\\/]/,
        //   priority: -10
        // }
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 3,
          enforce: true
        }
      }
    }
  }

})

module.exports = webpackConfig