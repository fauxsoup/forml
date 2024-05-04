const path = require('path');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    resolve: {
        fallback: {
            events: false,
            process: false,
            zlib: false,
            stream: false,
            util: false,
            buffer: false,
            asset: false,
        },
        alias: {
            '@forml/core': path.resolve('../packages/core/src'),
            '@forml/hooks': path.resolve('../packages/hooks/src'),
            '@forml/context': path.resolve('../packages/context/src'),
            '@forml/decorator-barebones': path.resolve(
                '../packages/decorator-barebones/src'
            ),
            '@forml/decorator-mui': path.resolve(
                '../packages/decorator-mui/src'
            ),
            '@forml/decorator-pdf': path.resolve(
                '../packages/decorator-pdf/src'
            ),
        },
        extensions: ['.*', '.js', '.jsx'],
    },
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    optimization: {
        splitChunks: {},
    },
    entry: {
        app: path.resolve('./src/index.js'),
        iso: path.resolve('./src/iso.js'),
    },
    output: {
        chunkFilename: '[name].bundle.js',
        filename: '[name].bundle.js',
        publicPath: '/',
        path: path.resolve('./dist'),
    },
    devtool: process.env.NODE_ENV === 'production' ? false : 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.m?jsx?$/,
                enforce: 'pre',
                use: ['source-map-loader'],
            },
            {
                test: /\.m?jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    targets: {
                                        browsers: ['last 1 Chrome versions'],
                                    },
                                },
                            ],
                            '@babel/preset-react',
                        ],
                        plugins: ['@babel/plugin-transform-runtime'],
                    },
                },
            },
            { test: /\.css$/, type: 'asset/resource' },
            { test: /\.(eot|svg|ttf|woff|woff2)$/, type: 'asset/resource' },
        ],
    },
    plugins: [],
};
