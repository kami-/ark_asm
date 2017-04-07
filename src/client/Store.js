const Config = require("./Config");

var servers = {};

function getServers() {
    const serverIds = Object.getOwnPropertyNames(servers);
    return serverIds.map(id => servers[id]);
}

function getOrCreateServer(rawServer) {
    var server = servers[rawServer.serverId];
    if (!server) {
        server = createServer(rawServer);
        servers[server.serverId] = server;
    }
    return server;
}

function createServer(rawServer) {
    return {
        serverId: rawServer.serverId,
        data: Config.seriesAxes.reduce((acc, prop) => {
            acc[prop] = [];
            return acc;
        }, {})
    };
}

module.exports = {
    getServers: getServers,
    getOrCreateServer: getOrCreateServer
};