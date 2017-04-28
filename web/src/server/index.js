const http = require("http");
const fs = require("fs");

const express = require("express");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");
const WebSocket = require("ws");

const Server = require("./Server");
const Snapshot = require("./Snapshot");

function loadConfig() {
    const defaultConfig = {
        "port": 8083,
        "users": []
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

function basicAuthConfig(config) {
    return basicAuth({
        users: config.users,
        challenge: true
    });
}

function start() {
    const config = loadConfig();
    const app = express();
    const server = http.createServer(app);
    const wss = new WebSocket.Server({ server });

    app.use(bodyParser.json());

    app.use("/", [ basicAuthConfig(config), express.static("resources") ]);

    app.post("/mission-init", (request, response) => {
        response.json({});
    });

    app.post("/mission-snapshot", (request, response) => {
        const snapshot = Snapshot.parseSnapshot(request.body);
        const server = Server.getOrCreateServer(snapshot);
        Server.updateServer(server, snapshot);
        broadcastToClients(wss.clients, { type: "mission-snapshot", snapshot: server });
        response.json({});
    });

    server.listen(config.port, () => {
        console.log(`Listening on port ${server.address().port}.`);
    });
}

start();