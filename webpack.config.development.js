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
const commonConfig = require('./webpack.config.common');
const bodyParser = require('body-parser')
const parseBody = bodyParser.json();

module.exports = function (env) {
    return webpackMerge.strategy({
        entry: 'prepend'
    }
    )(commonConfig(env), {
        mode: 'development',

        entry: [
            'react-hot-loader/patch'
        ],
        output: {
            publicPath: '/'
        },

        devtool: 'eval',

        plugins: [
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NamedModulesPlugin()
        ],

        devServer: {
            port: 7090,
            hot: true,
            stats: 'normal',
            contentBase: resolve('../resources/manager'),
            publicPath: '/',
            proxy: {
                "/rest": {
                    target: "http://localhost:7080",
                    changeOrigin: true,
                    logLevel: 'debug',
                    onProxyReq(proxyReq, req, res) {
                        if (req.method == "POST") {
                            console.log('BODY', req.body)
                            /*parseBody(req, res, () => {
                                console.log('BODY', req.body)
                                proxyReq.write(req.body);
                                proxyReq.end();
                            })*/
                            proxyReq.write(JSON.stringify(req.body));
                            proxyReq.end();

                        }
                    }
                },
                "/system": {
                    target: "http://localhost:7080",
                    changeOrigin: true
                }
            },
            overlay: {
                warnings: true,
                errors: true
            },
            historyApiFallback: true,
            before: (app) => {
                app.use(parseBody)
            }
        }
    })
}
