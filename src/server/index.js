const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const fs = require("fs");

const Mission = require("./Mission");

function loadConfig() {
    const defaultConfig = {
        "httpPort": 8083,
        "webSocketPort": 8084
    };
    try {
        var config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        return config;
    } catch (e) {
        console.log("Error reading the config file, using default config: ", e);
        return defaultConfig;
    }
}

function broadcastMission(clients, mission) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(mission));
        }
    });
}

function start() {
    const config = loadConfig();

    const wss = new WebSocket.Server({
        perMessageDeflate: false,
        port: config.webSocketPort
    });

    const app = express();
    app.use(bodyParser.json());
    app.use("/", express.static("resources"));
    app.post("/mission-snapshot", (request, response) => {
        const mission = Mission.processSnapshot(request.body);
        broadcastMission(wss.clients, mission);
        response.json({});
    });

    const server = app.listen(config.httpPort, () => {
        console.log(`HTTP listening on port ${server.address().port}.`);
    });
}

start();