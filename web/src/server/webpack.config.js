const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: "./index.js"
    },

    output: {
        path: path.resolve(__dirname, "../../release"),
        filename: "[name].js"
    },

    target: "node",

    resolve: {
        extensions: [".js"],
        modules: ["../../node_modules"]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "config.json" }
        ])
    ]
};