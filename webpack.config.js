const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = {
    entry:'./statics/script.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
      },
      plugins: [
            new HtmlWebpackPlugin({
               title: 'Sudoku Solver Visualizer',
               template: './statics/index.html'
             }),
           ],
    module:{
        rules:[
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },
              {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                  loader: 'babel-loader',
                  options: {
                    presets: ['@babel/preset-env']
                  }
                }
              },
              {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  'file-loader',
                ],
              },
        ]
    },
    
    mode: process.env.NODE_ENV==='production' ? 'production' : 'development'
}