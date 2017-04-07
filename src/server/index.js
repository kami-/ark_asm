const express = require("express");
const bodyParser = require("body-parser");
const WebSocket = require("ws");
const fs = require("fs");

const Server = require("./Server");
const Snapshot = require("./Snapshot");

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

function broadcastToClients(clients, data) {
    clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
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

    app.post("/mission-init", (request, response) => {
        const serverId = request.body.serverId;
        Server.removeServer(serverId);
        broadcastToClients(wss.clients, { type: "mission-init", serverId: serverId });
        response.json({});
    });

    app.post("/mission-snapshot", (request, response) => {
        const snapshot = Snapshot.parseSnapshot(request.body);
        const server = Server.getOrCreateServer(snapshot);
        Server.updateServer(server, snapshot);
        broadcastToClients(wss.clients, { type: "mission-snapshot", snapshot: server });
        response.json({});
    });

    const server = app.listen(config.httpPort, () => {
        console.log(`HTTP listening on port ${server.address().port}.`);
    });
}

start();