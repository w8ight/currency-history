const path = require('path');
const webpack = require('webpack');
const config = require('config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const HtmlWebpackPluginConfigured = new HtmlWebpackPlugin({
//     template: __dirname + '/src/templates/index.ejs',
//     filename: 'index.html',
//     inject: 'body',
//     title: 'Webpack 2 Boilerplate',
//     rootId: 'root',
//     body: ''
// });

module.exports = {
    context: path.resolve(__dirname, './src'),
    entry: {
        app: './app.js',
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                // exclude: /(node_modules|bower_components)/,
                include: path.resolve(__dirname, './src'),
                loader: 'babel-loader',
                options: {
                    presets: ['env', 'react', 'stage-0'],
                    plugins: ['transform-runtime']
                }
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader']
                })
            }]
    },
    plugins: [
        new webpack.DefinePlugin({
            "__CONFIG__": JSON.stringify(config),
            'process.env.BROWSER': JSON.stringify(true)
        }),
        new ExtractTextPlugin('styles.css'),
        // HtmlWebpackPluginConfigured,
    ]
};