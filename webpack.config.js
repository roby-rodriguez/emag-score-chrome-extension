var autoprefixer = require('autoprefixer')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var ProvidePlugin = require('webpack/lib/ProvidePlugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require("html-webpack-plugin")
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')

module.exports = {
    entry: {
        // Content Script
        content_script: [ './src/content_script', './src/content_script/main'],
        // Background Page
        background: [
            'babel-polyfill',
            './src/background'
        ],
        // Browser Page
        browser_action: [
            'babel-polyfill',
            'bootstrap.js',
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
    externals: {
        jquery: "jQuery",
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
            browsers: [ '> 5%' ],
        })
    ],

    resolve: {
        alias: {
            'bootstrap.js': "bootstrap/dist/js/bootstrap.min",
            raphael: "raphael/raphael",
            morris: "morris.js/morris",
            moment: "moment/moment",
            datepicker: "eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min",
            'datepicker.css': "eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min",
            'bootstrap-toggle.js': "bootstrap-toggle/js/bootstrap-toggle.min",
            'bootstrap-toggle.css': "bootstrap-toggle/css/bootstrap-toggle.min",
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
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                "lib/jquery.min.js",
                "lib/sweetalert.min.js",
                "lib/sweetalert.css"
            ],
            append: false
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
            // plugins shared between components (browser page, content script etc.)
            {
                from: "node_modules/jquery/dist/jquery.min.js",
                to: "lib"
            },
            {
                from: "node_modules/sweetalert/dist/sweetalert.min.js",
                to: "lib"
            },
            {
                from: "node_modules/sweetalert/dist/sweetalert.css",
                to: "lib"
            },
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
