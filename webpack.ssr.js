'use strict'

const glob = require('glob')
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, './src/*/index-server.js'))
    console.log('entryFiles', entryFiles);
    Object.keys(entryFiles)
        .map((index) => {
            const entryFile = entryFiles[index];
            const match = entryFile.match(/src\/(.*)\/index-server\.js/)
            const pageName = match && match[1];
            if (pageName) {
                entry[pageName] = entryFile;
                htmlWebpackPlugins.push(
                    new HtmlWebpackPlugin({ // html 压缩
                        template: path.join(__dirname, `src/${pageName}/index.html`),
                        filename: `${pageName}.html`,
                        chunks: ['commons', pageName],
                        inject: true,
                        minify: {
                            html5: true,
                            collapseWhitespace: true,
                            preserveLineBreaks: false,
                            minifyCSS: true,
                            minifyJS: true,
                            removeComments: false
                        }
                    })
                )
            }
        })
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins } = setMPA();
console.log(htmlWebpackPlugins);
module.exports = {
    entry: entry,
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]-server.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /.js$/,
                use: [
                    'babel-loader',
                    'eslint-loader'
                ]
            },
            {
                test: /.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader', {
                    loader: 'postcss-loader', // 自动补全css头部
                    options: {
                        plugins: () => [
                            require('autoprefixer')({
                                overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                            })
                        ]
                    }
                },
                {
                    loader: 'px2rem-loader', // 将css中的px转为rem 搭配lib-flexible（自动计算根元素的font-size）
                    options: {
                        remUnit: 75,
                        remPrecision: 8
                    }
                }]
            },
            {
                test: /.(png|jpg|svg|jepg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]'
                        }
                    }
                ]
            },
            {
                test: /.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:8][ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({ // css hash
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsWebpackPlugin({ // css压缩
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        // new webpack.optimize.ModuleConcatenationPlugin() 
        // new HtmlWebpackExternalsPlugin({ // 提取公共文件 文件一般放cdn
        //     externals: [
        //         {
        //             module: 'react',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        //             global: 'React',
        //         },
        //         {
        //             module: 'react-dom',
        //             entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //             global: 'ReactDOM',
        //         },
        //     ],
        // })
    ].concat(htmlWebpackPlugins),
    devtool: 'inline-source-map', // source map
    mode: 'development',
    // production ===> tree shaking    scope hositing
    optimization: {
        splitChunks: {
            minSize: 1000,
            cacheGroups: {
                commons: {
                    chunks: 'all',
                    name: 'commons',
                    minChunks: 2
                }
            }
        }
    }

}