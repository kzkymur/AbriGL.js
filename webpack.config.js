module.exports = {
    mode: 'production',
    entry: __dirname + "/src/init.js", 
    output: {
        path: __dirname, //ビルドしたファイルを吐き出す場所
		filename: 'abrigl.js',
		library: 'AbriGL',
		libraryTarget: 'umd',
		libraryExport: "default"
    },
    module: {
        rules: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query:{
                presets: [["@babel/preset-env"]]
            }
        }]
    }
};
