const path = require('path');

const mode = process.env.mode ?? "production";

module.exports = {
    entry: "./src/main.js",
    plugins: [
    ],
    mode,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
};