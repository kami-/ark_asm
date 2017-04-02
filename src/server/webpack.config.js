const path = require("path");

module.exports = {
    entry: {
        app: "./index.js"
    },

    output: {
        path: path.resolve(__dirname, "../../release/server"),
        filename: "[name].js"
    },

    target: "node",

    resolve: {
        extensions: [".js"],
        modules: ["../../node_modules"]
    }
};