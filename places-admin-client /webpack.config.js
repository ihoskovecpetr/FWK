const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bund.js'
    },
    module: {
  rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" },
    { test: /\.css$/, loader: 'style-loader!css-loader' },
    //{ test: /\.svg$/, use: [{ loader: "babel-loader" }, { loader: "react-svg-loader", options: { jsx: true }}]},
    {test: /\.(png|jpg|gif|svg)$/, use: [
                                      { loader: 'file-loader', options: {
                                                                    name: '[name].[ext]',
                                                                    outPath: './img/',
                                                                    publicPath: ''} } ] }
      ]
},
devServer: {
   port: 8081,
   proxy: {
     '/api/**': {
       target: 'http://localhost:3001',
       secure: false,
       changeOrigin: true
     }
   }
 },
plugins: [

    new HtmlWebpackPlugin ({
        template: './public/index.html'
    })
]
}
