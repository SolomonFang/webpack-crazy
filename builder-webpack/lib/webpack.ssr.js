const merge = require('webpack-merge');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const baseConfig = require('./webpack.base');

const ssrCondig = {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: 'ignore-loader',
      },
      {
        test: /\.scss$/,
        use: 'ignore-loader',
      },
    ],
  },
  plugins: [
    new OptimizeCssAssetsWebpackPlugin({ // css压缩
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new HtmlWebpackExternalsPlugin({ // 提取公共文件 文件一般放cdn
      externals: [
        {
          module: 'react',
          entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  optimization: {
    splitChunks: {
      minSize: 1000,
      cacheGroups: {
        commons: {
          chunks: 'all',
          name: 'commons',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, ssrCondig);
