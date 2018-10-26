/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const resolve = require('path').resolve;
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = function(env) {

/*const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: env !== "production"
});*/
const devMode = env !== "production"

return {
    context: resolve(__dirname, 'src'),

    entry: [
        './index.jsx'
    ],
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'build')
    },

    devtool: 'eval',

    watchOptions: {
        ignored: /node_modules/,
    },

    resolve: {
        extensions: [".js", ".jsx", ".json", ".scss"]
    },

    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: [{
                    loader: 'babel-loader',
                }],
                exclude: /node_modules(?!(\/|[\\]+)xtraplatform)/
            },
            {
                test: /\.scss$/,
                /*use: extractSass.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader",
                        options: {
                            includePaths: ["node_modules"]
                        }
                    }],
                    fallback: "style-loader"
                })*/
                use: [
                    devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: "sass-loader",
                        options: {
                            includePaths: ["node_modules"]
                        }
                    }
                ]
            }
        ],
    },

    optimization: {
        splitChunks: {
            cacheGroups: {
                vendors: {
                    test: /[\\/](node_modules|vendor)[\\/]/
                }
            }
        }
    },

    plugins: [

        /*new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: function(module) {
                return module.context && (module.context.indexOf('node_modules') !== -1 || module.context.indexOf('vendor') !== -1);
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'manifest'
        }),*/
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? '[name].css' : '[name].[hash].css',
            chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
        }),

        new HtmlWebpackPlugin({
            title: 'XtraPlatform Manager',
            //favicon: 'assets/img/favicon.png',
            template: resolve(__dirname, 'src/index.html')
        }),

        //extractSass

    ],
}
};
