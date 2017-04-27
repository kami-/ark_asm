const ws = require("ws");

const Config = require("./Config");

let server;

function listen() {
    server = new ws.Server({
        perMessageDeflate: false,
        port: Config.webSocketPort
    });

    server.on("connection", client => {
        client.on("message", message => {
            try {
                handleClient(client, JSON.parse(message));
            } catch (e) {
                console.log("Failed to parse client message: ", e);
            }
        });
    });
}

function handleClient(client, message) {
    if (message.type) { return; }
    if (message.type === "")
}

function broadcastToClients(data) {
    server.clients
        .filter(client => client.readyState === ws.OPEN)
        .forEach(client => { client.send(JSON.stringify(data)); });
}

function broadcastLogToClients(clients, file, line) {
    const watchClients = server.clients.filter(client => clients.has(client));
    broadcastToClients(watchClients, { type: "line", file: file, line: line });
}

module.exports = {
    listen: listen,
    broadcastToClients: broadcastToClients,
    broadcastLogToClients: broadcastLogToClients
};