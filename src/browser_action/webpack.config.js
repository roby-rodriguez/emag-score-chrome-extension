var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ProvidePlugin = require('webpack/lib/ProvidePlugin')

module.exports = {
    entry: [
        'babel-polyfill',
        'raphael',
        'morris',
        './src/main',
    ],
    output: {
        // TODO change this later on
        path: './dist',
        filename: 'build.js',
    },
    module: {
        loaders: [
            {
                test: /\.vue$/,
                loader: 'vue',
            },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                loader: 'style!css',
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style', 'css!-autoprefixer!postcss!less'),
            },
            {
                test: /\.(woff|woff2)$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            },
        ],
    },
    vue: {
        loaders: {
            js: 'babel',
            css: ExtractTextPlugin.extract("css"),
            less: ExtractTextPlugin.extract("css!postcss!less"),
        },
    },

    postcss: [
        autoprefixer({
            browsers: ['last 2 versions'],
        })
    ],

    resolve: {
        alias: {
            jquery: "jquery/src/jquery",
            raphael: "raphael/raphael.js",
            morris: "morris.js/morris.js",
        },
        extensions: ['', '.js', '.vue', '.css'],
    },

    plugins: [
        autoprefixer,
        new ExtractTextPlugin("style.css"),
        new ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            Raphael: "raphael",
        }),
    ],
}
