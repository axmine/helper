let path = require('path');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry:'./src/index.ts',
    output: {
        filename: 'helper.min.js',
        path: path.resolve('dist'),
        library      : 'helper',
        // libraryTarget: 'umd',
        libraryExport: "default",
    },
    devServer: {
        contentBase: './dist',
        host: 'localhost',
        //host: '0.0.0.0',
        port: 8384,
        open: false,
        hot: false
    },
    module:{
        rules:[
			{
			  test: /\.tsx?$/,
			  use: {
				loader: 'ts-loader'
			  }
			}
        ]
    },
	plugins: [
		new HtmlWebpackPlugin({
            template: './index.html',
            hash: false,
    }),
	],
    optimization: {
        minimize: false
    }
}
