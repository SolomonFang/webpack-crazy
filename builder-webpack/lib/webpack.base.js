const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const glob = require('glob');
const path = require('path');
const autoprefixer = require('autoprefixer');

const projectRoot = process.cwd();

const setMPA = () => {
  const entry = {};
  const htmlWebpackPlugins = [];
  const entryFiles = glob.sync(path.join(projectRoot, './src/*/index.js'));

  Object.keys(entryFiles)
    .map((index) => {
      const entryFile = entryFiles[index];
      const match = entryFile.match(/src\/(.*)\/index\.js/);
      const pageName = match && match[1];
      entry[pageName] = entryFile;
      return htmlWebpackPlugins.push(
        new HtmlWebpackPlugin({ // html 压缩
          template: path.join(projectRoot, `./src/${pageName}/index.html`),
          filename: `${pageName}.html`,
          chunks: ['commons', pageName],
          inject: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        }),
      );
    });
  return {
    entry,
    htmlWebpackPlugins,
  };
};

const { entry, htmlWebpackPlugins } = setMPA();

module.exports = {
  entry,
  output: {
    path: path.join(projectRoot, 'dist'),
    filename: '[name]_[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /.js$/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
          loader: 'postcss-loader', // 自动补全css头部
          options: {
            plugins: () => [
              autoprefixer({
                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7'],
              }),
            ],
          },
        },
        {
          loader: 'px2rem-loader', // 将css中的px转为rem 搭配lib-flexible（自动计算根元素的font-size）
          options: {
            remUnit: 75,
            remPrecision: 8,
          },
        }],
      },
      {
        test: /.(png|jpg|svg|jepg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8][ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ // css hash
      filename: '[name]_[contenthash:8].css',
    }),
    new CleanWebpackPlugin(),
    new FriendlyErrorPlugin(), // 友好报错
    function errorPlugin() {
      this.hooks.done.tap('done', (stats) => {
        if (stats.compilation.errors && stats.compilation.errors.length && process.argv.indexOf('--watch') === -1) {
          console.log(stats.compilation.errors); // eslint-disable-line
          process.exit(1);
        }
      });
    },
  ].concat(htmlWebpackPlugins),
  stats: 'errors-only',
};
