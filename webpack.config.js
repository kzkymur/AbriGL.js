module.exports = {
    mode: 'development',
    entry: __dirname + "/src/init.js", //ビルドするファイル
    output: {
        path: __dirname, //ビルドしたファイルを吐き出す場所
        filename: 'smgl.js', //ビルドした後のファイル名
        library: 'smgl',
        libraryTarget: 'umd',
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