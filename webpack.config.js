module.exports = {
    mode: 'development',
    entry: __dirname + "/init.js", //ビルドするファイル
    output: {
        path: __dirname, //ビルドしたファイルを吐き出す場所
        filename: 'smgl.js' //ビルドした後のファイル名
    },
      module: {
      rules: [
              //loader
            {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query://loaderに渡したいクエリパラメータを指定します
                {
                presets: [["@babel/preset-env"]]
                }
            }
        ]
    }
};