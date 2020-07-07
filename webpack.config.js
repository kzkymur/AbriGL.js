module.exports = {
    mode: 'development',
    entry: __dirname + "/src/init.js", //ビルドするファイル
    output: {
        path: __dirname, //ビルドしたファイルを吐き出す場所
        filename: 'main.js', //ビルドした後のファイル名 //[name]でentryが{key, name}の時のkeyを代入できる
        library: 'AbriGL',
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
