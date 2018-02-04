const path = require('path');
const Webpack = require('webpack');


const jsEntry = [path.join(__dirname, './src/')];

const config = {
    entry: () => jsEntry,
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },

    module: {

        rules: [
            {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'},
            {test: /\.css$/, loader: 'style-loader!css-loader'},
            {test: /\.scss$/, loaders: ['style-loader', 'css-loader', 'sass-loader']},
            {test: /\.json$/, loader: 'json-loader'},
            {test: /\.png$/, loader: 'file-loader'}
        ]
    },
    devtool: 'eval'
};

module.exports = config;