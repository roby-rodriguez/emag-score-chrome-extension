var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ProvidePlugin = require('webpack/lib/ProvidePlugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
    entry: {
        // Content Script
        content_script: [ './src/content_script', './src/content_script/main'],
        // Background Page
        background: './src/background',
        // Browser Page
        browser_action: [
            'babel-polyfill',
            'raphael',
            'morris',
            './src/browser_action/main',
        ],
    },
    output: {
        // TODO change this later on
        path: './dist',
        filename: '[name].build.js',
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
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "background.html",
            chunks: [ "background" ]
        }),
        new HtmlWebpackPlugin({
            template: "./src/index.html",
            filename: "options_page.html",
        }),
        new HtmlWebpackPlugin({
            title: "Tracked products",
            favicon: "./res/icons/icon16.png",
            template: "./src/index.html",
            filename: "browser_action.html",
            chunks: [ "browser_action" ]
        }),
        new CopyWebpackPlugin([
            { from: "manifest.json" },
            { from: "node_modules/sweetalert/dist/sweetalert.min.js" },
            { from: "node_modules/sweetalert/dist/sweetalert.css" },
            {
                from: "_locales",
                to: "_locales"
            },
            {
                from: "res",
                to: "res"
            },
            {
                from: "src/content_script/style.css",
                to: "content_script.css"
            },
        ]),
    ],
}
