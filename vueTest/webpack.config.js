const path = require('path');
const isDev = process.env.NODE_ENV === 'development'
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
// const ExtractPlugin = require('extract-text-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = {
    mode: 'none',

    target: 'web',

    entry: path.join(__dirname, "src/index.js"), //webpack4官方绝对路径

    output: {
        filename: 'bundle.[hash:8].js',
        path: path.join(__dirname, 'dist')
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader'
            //     ]
            // },

            {
                test: /\.(gif|jpg|jpeg|png|svg)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        limit: 1024,
                        name: '[name]-aaa.[ext]'
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isDev ? '"development"' : '"production"'
            }
        }),
        new HTMLPlugin()
    ]

};

if (isDev) {
    config.module.rules.push({

        test: /\.styl/,
        use: [
            'style-loader',
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                }
            },
            'stylus-loader'
        ]


    })
    config.devtool = '#cheap-module-eval-source-map' //方便在浏览器调试代码
    config.devServer = {
        port: '8000',
        host: '0.0.0.0',
        overlay: {
            errors: true
        },
        //open:true//自动打开浏览器
        // historyFallback:{

        // }
        // 将没有映射的地址映射到index.html

        hot: true
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin
    )
} else {
    config.entry = {
        app: path.join(__dirname, 'src/index.js'),
        vender: ['vue']
    }
    config.output.filename = '[name].[chunkhash:8].js'
    let extractLoader = {
        loader: MiniCssExtractPlugin.loader,
        options: {}
    }
    config.module.rules.push({
        test: /\.styl/,
        use: [
            extractLoader,
            'css-loader',
            {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true
                }
            },
            'stylus-loader'
        ]
    })
    config.plugins.push(
        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash:8].css"
        }),
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor'
        // })
    )
    config.optimization = {
        splitChunks: {
            cacheGroups: {
                commons: {
                    chunks: 'initial',
                    minChunks: 2,
                    maxInitialRequests: 5,
                    minSize: 0
                },
                vendor: {
                    test: /node_modules/,
                    chunks: 'initial',
                    name: 'vendor',
                    priority: 10,
                    enforce: true
                }
            }
        },
        runtimeChunk: true
    }
}
module.exports = config