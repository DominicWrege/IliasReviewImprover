const path = require('path');

const mode = process.env.mode ?? "production";

console.log(`using mode: ${mode}`);

module.exports = {
    entry: path.resolve(__dirname, "src/main.ts"),
    plugins: [
    ],
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    mode,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};