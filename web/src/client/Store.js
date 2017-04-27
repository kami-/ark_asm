const Config = require("./Config");

var servers = {};

function getServers() {
    const serverIds = Object.getOwnPropertyNames(servers);
    return serverIds.map(id => servers[id]);
}

function getOrCreateServer(serverId) {
    var server = servers[serverId];
    if (!server) {
        server = createServer(serverId);
        servers[server.serverId] = server;
    }
    return server;
}

function createServer(serverId) {
    return {
        serverId: serverId,
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