const path = require('path');

const mode = process.env.mode ?? "production";

console.log(`using mode: ${mode}`);

module.exports = {
    entry: "./src/main.js",
    plugins: [
    ],
    resolve: {
        extensions: [".js"]
    },
    mode,
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, "dist"),
        clean: true,
    },
};