const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.tsx',
    output: {
        filename: 'bundle.[contenthash].js', //hash 更新时，
        path:path.resolve(__dirname, 'dist'),
        clean: true
    },
    module: {
      rules:[
        {
            test: /\.(js|jsx|ts|tsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-react',
                        [
                            '@babel/preset-typescript', {
                                
                            }
                        ]
                    ]
                }
            }
        },
        {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }
    ]},
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'public/index.html'),
            filename: 'index.html'
        })
    ],
    devServer: {
      port: 8080,
      open: true,
      hot: true,
      static: {
        directory: path.resolve(__dirname,'dist')
      }
    }
}