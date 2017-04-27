const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        app: "./App.js"
    },

    output: {
        path: path.resolve(__dirname, "../../release/server/resources"),
        filename: "js/[name].js"
    },

    resolve: {
        extensions: [".js"],
        modules: ["../../node_modules"]
    },

    plugins: [
        new CopyWebpackPlugin([
            { from: "index.html" }
        ])
    ]
};