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
    { test: /\.css$/, loader: 'style-loader!css-loader' }
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
