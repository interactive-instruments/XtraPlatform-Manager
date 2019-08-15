/*
 * Copyright 2018 interactive instruments GmbH
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
const resolve = require('path').resolve;
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const commonConfig = require('./webpack.config.common');

module.exports = function(env) {
return webpackMerge(commonConfig(env), {
    mode: 'production',

    output: {
        filename: '[name].[chunkhash].js',
    },

    devtool: 'eval',

    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ['build']}),

        new webpack.HashedModuleIdsPlugin(),

        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    ]
})
}

