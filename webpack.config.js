const nodeExternals = require('webpack-node-externals')

module.exports = {
    mode: "development",
    target: "node",
    externals: [nodeExternals()],
    entry: "./src/server/server.ts",
    output: {
        path: __dirname + "/build/server",
    },
    devtool: 'source-map',
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['css-loader'],
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    transpileOnly: true,
                    onlyCompileBundledFiles: true,
                    reportFiles: ['src/server/server.ts'],
                },
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'source-map-loader',
            },
            {
                test: /\.(png|jpe?g|gif|tff)$/i,
                use: ['file-loader'],
            },
        ],
    },
};
