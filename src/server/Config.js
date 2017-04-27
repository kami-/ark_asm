const fs = require("fs");

let config;

function loadConfig() {
    const defaultConfig = {
        "httpPort": 8083,
        "webSocketPort": 8084
    };
    try {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        return config;
    } catch (e) {
        console.log("Error reading the config file, using default config: ", e);
        return defaultConfig;
    }
}

if (!config) {
    config = loadConfig();
}

module.exports = config;