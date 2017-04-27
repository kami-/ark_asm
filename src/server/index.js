const express = require("express");
const basicAuth = require("express-basic-auth");
const bodyParser = require("body-parser");
const fs = require("fs");

const Config = require("./Config");
const LogWatcher = require("./LogWatcher");
const WebSocket = require("./WebSocket");
const Server = require("./Server");
const Snapshot = require("./Snapshot");


function basicAuthConfig(users) {
    return basicAuth({
        users: users,
        challenge: true
    });
}

function start() {
    LogWatcher.init();
    WebSocket.listen();
    const app = express();
    app.use(bodyParser.json());

    app.use("/", [ basicAuthConfig(Config.users), express.static("resources") ]);

    app.post("/mission-init", (request, response) => {
        response.json({});
    });

    app.post("/mission-snapshot", (request, response) => {
        const snapshot = Snapshot.parseSnapshot(request.body);
        const server = Server.getOrCreateServer(snapshot);
        Server.updateServer(server, snapshot);
        WebSocket.broadcastToClients({ type: "mission-snapshot", snapshot: server });
        response.json({});
    });

    const server = app.listen(Config.httpPort, () => {
        console.log(`HTTP listening on port ${server.address().port}.`);
    });
}

start();